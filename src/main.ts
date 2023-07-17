import { CustomVideoElement } from "custom-media-element";
import mpegts from "mpegts.js";

class MpegtsVideoElement extends CustomVideoElement {
  #player: mpegts.Player | null = null;
  #firstLoad: boolean = true;

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

  load(): void {
    this.#destroy();
    if (mpegts.getFeatureList().mseLivePlayback) {
      this.#player = mpegts.createPlayer(
        {
          type: "mse",
          isLive: true,
          url: this.src,
        },
        {
          lazyLoadMaxDuration: 3 * 60,
          enableWorker: true,
          reuseRedirectedURL: true,
        }
      );
      this.#player.attachMediaElement(this.nativeEl);
      this.#player.load();

      if (this.#firstLoad) {
        if (this.hasAttribute("muted")) {
          this.nativeEl.muted = true;
        }
        this.#firstLoad = false;
      }

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
    this.load();
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
