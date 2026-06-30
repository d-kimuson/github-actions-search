import { resolve } from "node:path"
import preact from "@preact/preset-vite"
import { defineConfig } from "vite"
import webExtension, { readJsonFile } from "vite-plugin-web-extension"

const generateManifest = () => {
  const manifest = readJsonFile("./manifest.json")
  const pkg = readJsonFile("./package.json")
  return {
    name: pkg.name,
    description: pkg.description,
    version: pkg.version,
    ...manifest,
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    webExtension({
      manifest: generateManifest,
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
})
