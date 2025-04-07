module.exports = {
  globDirectory: "build/",
  globPatterns: ["**/*.{html,js,css,png,jpg,jpeg,svg,json,ico}", "**/*.csv"],
  swDest: "build/sw.js",
  navigateFallback: "/offline.html",
  runtimeCaching: [
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 7 * 24 * 60 * 60, // 7 days
        },
      },
    },
    {
      urlPattern: new RegExp("https://script.google.com/macros/"),
      handler: "NetworkFirst",
      options: {
        cacheName: "google-scripts",
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
        },
      },
    },
  ],
};
