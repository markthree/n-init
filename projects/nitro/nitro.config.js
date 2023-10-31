export default defineNitroConfig({
  experimental: {
    openAPI: true,
    asyncContext: true,
  },
  minify: true,
  sourceMap: false,
  preset: "node-cluster",
  compressPublicAssets: true,
  appConfigFiles: ["app.config.js"],
  logging: {
    compressedSizes: false,
  },
});
