import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/main.ts"),
      name: "mpegtsVideoElement",

      // the proper extensions will be added
      fileName: "mpegts-video-element",
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  test: {
    coverage: {
      provider: "v8",
    },
  },
});
