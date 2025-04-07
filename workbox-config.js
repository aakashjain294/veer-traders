module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{html,js,css,png,jpg,jpeg,svg,json,ico}"],
  swDest: "build/sw.js",
  navigateFallback: "/index.html",
  navigateFallbackAllowlist: [/^\/$/], // 👈 Important for SPA routing
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
    {
      urlPattern: /^https:\/\/script\.google\.com\/macros\/s\/.*/,
      handler: "NetworkFirst",
      options: {
        cacheName: "google-sheets",
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 5,
          maxAgeSeconds: 24 * 60 * 60,
        },
        cacheableResponse: {
          statuses: [0, 200],
        },
      },
    },
  ],
};
