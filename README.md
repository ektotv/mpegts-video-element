# `<mpegts-video>`

[![Version](https://img.shields.io/npm/v/mpegts-video-element?style=flat-square)](https://www.npmjs.com/package/mpegts-video-element)

A [custom element](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_custom_elements)
for mpegts.js with an API that aims to match the
[`<video>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) API.

- 🏄‍♂️ Compatible [`HTMLMediaElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement) API
- 🕺 Seamlessly integrates with [Media Chrome](https://github.com/muxinc/media-chrome)

## Example

<!-- prettier-ignore -->
```html
<mpegts-video muted autoplay controls src="http://192.168.1.110/streaming/camera.ts"></mpegts-video>
```

With Media Chrome

```html
<media-controller noautoseektolive defaultstreamtype="live">
  <mpegts-video slot="media" muted autoplay src="http://192.168.1.110/streaming/camera.ts"></mpegts-video>

  <media-loading-indicator slot="centered-chrome" noautohide></media-loading-indicator>

  <media-control-bar>
    <media-play-button></media-play-button>
    <media-mute-button></media-mute-button>
    <media-volume-range></media-volume-range>
    <media-time-range></media-time-range>
    <span class="spacer"></span>
    <media-pip-button></media-pip-button>
    <media-captions-button></media-captions-button>
    <media-live-button disabled></media-live-button>
    <media-fullscreen-button></media-fullscreen-button>
  </media-control-bar>
</media-controller>
```

## Install

First install the NPM package:

```bash
# with pnpm
pmpm add mpegts-video-element

# with yarn
yarn add mpegts-video-element

# with npm
npm install mpegts-video-element
```

Import in your app javascript (e.g. src/App.js):

```js
import 'mpegts-video-element';
```

Optionally, you can load the script directly from a CDN using [esm.run](https://esm.run/):

<!-- prettier-ignore -->
```html
<script type="module" src="https://esm.run/mpegts-video-element"></script>
```

This will register the custom elements with the browser so they can be used as HTML.

## Deferred mode

By default, the element will load and setup the mpegts.js player immediately. This behaviour can be deferred so you can control when the player is loaded by adding a `defer` attribute to the element.

This is useful when you want to pass a custom `mpegts.js` configuration to the player.

```html
<mpegts-video muted autoplay controls src="http://192.168.1.109/stream.ts" defer></mpegts-video>

<script>
  customElements.whenDefined('mpegts-video').then(() => {
    const video = document.querySelector('mpegts-video');

    // set a custom mpegts config
    video.mpegtsConfig = {
      lazyLoadMaxDuration: 3 * 60,
      enableWorker: true,
      reuseRedirectedURL: true,
    };

    //set a custom mpegts logging config
    video.mpegtsLoggingConfig = {
      forceGlobalTag: true,
      globalTag: 'mpegts-video-element',
      enableVerbose: true,
    };

    // then load the player
    video.load();
  });
</script>
```

## Related

- [Media Chrome](https://github.com/muxinc/media-chrome) Your media player's dancing suit. 🕺
- [`<dash-video>`](https://github.com/luwes/dash-video-element) Custom element for playing video using the DASH format.
- [`<youtube-video>`](https://github.com/muxinc/youtube-video-element) A custom element for the YouTube player.
- [`<vimeo-video>`](https://github.com/luwes/vimeo-video-element) A custom element for the Vimeo player.
- [`<jwplayer-video>`](https://github.com/luwes/jwplayer-video-element) A custom element for the JW player.
- [`<videojs-video>`](https://github.com/luwes/videojs-video-element) A custom element for Video.js.
- [`<wistia-video>`](https://github.com/luwes/wistia-video-element) A custom element for the Wistia player.
- [`<cloudflare-video>`](https://github.com/luwes/cloudflare-video-element) A custom element for the Cloudflare player.
- [`<hls-video>`](https://github.com/muxinc/hls-video-element) A custom element for playing HTTP Live Streaming (HLS) videos.
- [`castable-video`](https://github.com/muxinc/castable-video) Cast your video element to the big screen with ease!
- [`<mux-player>`](https://github.com/muxinc/elements/tree/main/packages/mux-player) The official Mux-flavored video player custom element.
- [`<mux-video>`](https://github.com/muxinc/elements/tree/main/packages/mux-video) A Mux-flavored HTML5 video element w/ hls.js and Mux data builtin.

```

```
