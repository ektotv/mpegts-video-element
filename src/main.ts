import { CustomVideoElement } from "custom-media-element";
import mpegts from "mpegts.js";
import type Mpegts from "mpegts.js";

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

  #player: mpegts.Player | null = null;
  #firstLoad: boolean = true;

  mpegtsConfig: Mpegts.Config = {};
  #defaultMpegtsConfig: Mpegts.Config = {
    lazyLoadMaxDuration: 3 * 60,
    enableWorker: true,
    reuseRedirectedURL: true,
  };

  mpegtsLoggingConfig: Partial<Mpegts.LoggingControlConfig> = {};
  #defaultMpegtsLoggingConfig: Mpegts.LoggingControlConfig = {
    forceGlobalTag: false,
    globalTag: "mpegts-video-element",
    enableAll: false,
    enableDebug: false,
    enableVerbose: false,
    enableInfo: false,
    enableWarn: false,
    enableError: false,
  };

  load(): void {
    this.#destroy();
    if (mpegts.getFeatureList().mseLivePlayback) {
      if (this.#firstLoad) {
        mpegts.LoggingControl.applyConfig({
          ...this.#defaultMpegtsLoggingConfig,
          ...this.mpegtsLoggingConfig,
        });

        if (this.hasAttribute("muted")) {
          this.nativeEl.muted = true;
        }
        this.#firstLoad = false;
      }

      this.#player = mpegts.createPlayer(
        {
          type: "mse",
          isLive: true,
          url: this.src,
        },
        { ...this.#defaultMpegtsConfig, ...this.mpegtsConfig }
      );

      this.#player.attachMediaElement(this.nativeEl);
      this.#player.load();

      if (this.hasAttribute("autoplay")) {
        this.nativeEl.play();
      }

      this.#player.on(mpegts.Events.ERROR, (event) => {
        console.error(event);
        this.load();
      });
    }
  }

  #destroy() {
    if (this.#player) {
      this.#player.pause();
      this.#player.unload();
      this.#player.detachMediaElement();
      this.#player.destroy();
      this.#player = null;
    }
  }

  connectedCallback(): void {
    if (!this.hasAttribute("defer")) {
      this.load();
    }
  }

  disconnectedCallback(): void {
    this.#destroy();
  }
}

if (
  globalThis.customElements &&
  !globalThis.customElements.get("mpegts-video")
) {
  globalThis.customElements.define("mpegts-video", MpegtsVideoElement);
}

export default MpegtsVideoElement;
