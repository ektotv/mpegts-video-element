import { CustomVideoElement } from 'custom-media-element';
import Mpegts from 'mpegts.js';

class MpegtsVideoElement extends CustomVideoElement {
  constructor() {
    super();
  }

  attributeChangedCallback(attrName: string, oldValue: string | null, newValue: string | null) {
    if (attrName !== 'src') {
      super.attributeChangedCallback(attrName, oldValue, newValue);
    }

    if (attrName === 'src' && oldValue != newValue) {
      if (this.#initialized) this.load();

      if (this.hasAttribute('defer')) return;
      this.load();
    }
  }

  api: Mpegts.Player | null = null;
  #initialized = false;

  mpegtsConfig: Mpegts.Config = {};
  #defaultMpegtsConfig: Mpegts.Config = {
    lazyLoadMaxDuration: 3 * 60,
    enableWorker: true,
    reuseRedirectedURL: true,
  };

  mpegtsLoggingConfig: Partial<Mpegts.LoggingControlConfig> = {};
  #defaultMpegtsLoggingConfig: Mpegts.LoggingControlConfig = {
    forceGlobalTag: false,
    globalTag: 'mpegts-video-element',
    enableAll: false,
    enableDebug: false,
    enableVerbose: false,
    enableInfo: false,
    enableWarn: false,
    enableError: false,
  };

  async load(): Promise<void> {
    this.#destroy();

    if (!this.src) {
      return;
    }

    if (Mpegts.getFeatureList().mseLivePlayback) {
      Mpegts.LoggingControl.applyConfig({
        ...this.#defaultMpegtsLoggingConfig,
        ...this.mpegtsLoggingConfig,
      });

      this.api = Mpegts.createPlayer(
        {
          type: 'mse',
          isLive: true,
          url: this.src,
        },
        { ...this.#defaultMpegtsConfig, ...this.mpegtsConfig },
      );

      this.api.attachMediaElement(this.nativeEl);

      switch (this.preload) {
        case 'none': {
          // when preload is none, load the source on first play
          const loadSourceOnPlay = () => this.api?.load();
          this.nativeEl.addEventListener('play', loadSourceOnPlay, {
            once: true,
          });

          break;
        }
        case 'metadata': {
          // mpegts.js does not support loading metadata only
          // so we load the source immediately and then unload it
          // when the first frame is decoded

          if (this.hasAttribute('autoplay')) {
            this.nativeEl.autoplay = false;
          }

          const beginLoadingAndPlay = () => {
            // create a whole new player instance
            this.#destroy();
            this.api = Mpegts.createPlayer(
              {
                type: 'mse',
                isLive: true,
                url: this.src,
              },
              { ...this.#defaultMpegtsConfig, ...this.mpegtsConfig },
            );

            this.api.attachMediaElement(this.nativeEl);
            this.api?.load();

            this.nativeEl.play();
          };

          this.nativeEl.addEventListener('play', beginLoadingAndPlay, {
            once: true,
          });

          this.api.load();

          const unloadOnFirstFrame = (e: any) => {
            if (e.decodedFrames < 1) return;
            this.api?.unload();
            this.api?.off(Mpegts.Events.STATISTICS_INFO, unloadOnFirstFrame);
          };

          this.api.on(Mpegts.Events.STATISTICS_INFO, unloadOnFirstFrame);

          break;
        }
        default: {
          // load source immediately for any other preload value
          this.api.load();

          if (this.hasAttribute('autoplay')) {
            this.nativeEl.play();
          }
        }
      }

      this.api.on(Mpegts.Events.ERROR, (event) => {
        console.error(event);
        this.load();
      });
    }

    this.#initialized = true;
  }

  #destroy() {
    if (this.api) {
      this.api.destroy();
      this.api = null;
    }
  }

  disconnectedCallback(): void {
    this.#destroy();
  }
}

if (globalThis.customElements && !globalThis.customElements.get('mpegts-video')) {
  globalThis.customElements.define('mpegts-video', MpegtsVideoElement);
}

export default MpegtsVideoElement;
