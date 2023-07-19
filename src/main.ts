import { CustomVideoElement } from 'custom-media-element';
import Mpegts from 'mpegts.js';

class MpegtsVideoElement extends CustomVideoElement {
  constructor() {
    super();
  }

  get src() {
    return super.src;
  }

  set src(src) {
    super.src = src;
    this.load();
  }

  #player: Mpegts.Player | null = null;

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

  load(): void {
    this.#destroy();
    if (Mpegts.getFeatureList().mseLivePlayback) {
      Mpegts.LoggingControl.applyConfig({
        ...this.#defaultMpegtsLoggingConfig,
        ...this.mpegtsLoggingConfig,
      });

      this.#player = Mpegts.createPlayer(
        {
          type: 'mse',
          isLive: true,
          url: this.src,
        },
        { ...this.#defaultMpegtsConfig, ...this.mpegtsConfig },
      );

      this.#player.attachMediaElement(this.nativeEl);
      this.#player.load();

      if (this.hasAttribute('autoplay')) {
        this.nativeEl.play();
      }

      this.#player.on(Mpegts.Events.ERROR, (event) => {
        console.error(event);
        this.load();
      });
    }
  }

  #destroy() {
    if (this.#player) {
      this.#player.destroy();
      this.#player = null;
    }
  }

  connectedCallback(): void {
    if (!this.hasAttribute('defer')) {
      this.load();
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
