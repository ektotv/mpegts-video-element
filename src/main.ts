import { CustomVideoElement } from "custom-media-element";
import mpegts from "mpegts.js";

class MpegtsVideoElement extends CustomVideoElement {
  #player: mpegts.Player | null = null;

  constructor() {
    super();
  }

  // Override the src getter & setter.
  get src() {
    return super.src;
  }

  set src(src) {
    super.src = src;
  }

  load(): void {
    if (this.#player) {
      this.#player.pause();
      this.#player.unload();
      this.#player.detachMediaElement();
      this.#player.destroy();
      this.#player = null;
    }

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
          seekType: "param",
          reuseRedirectedURL: true,
        }
      );
      this.#player.attachMediaElement(this.nativeEl);
      this.#player.load();

      if (this.hasAttribute("muted")) {
        this.nativeEl.muted = true;
      }
      if (this.hasAttribute("autoplay")) {
        this.nativeEl.play();
      }

      this.#player.on(mpegts.Events.ERROR, (event) => {
        console.error(event);
      });
    }
  }

  connectedCallback(): void {
    this.load();
  }
}

if (
  globalThis.customElements &&
  !globalThis.customElements.get("mpegts-video")
) {
  globalThis.customElements.define("mpegts-video", MpegtsVideoElement);
}

export default MpegtsVideoElement;
