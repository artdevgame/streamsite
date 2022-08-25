// /** @type {import('@remix-run/dev').AppConfig} */
// module.exports = {
//   serverBuildTarget: "netlify",
//   server:
//     process.env.NETLIFY || process.env.NETLIFY_LOCAL
//       ? "./server.js"
//       : undefined,
//   ignoredRouteFiles: ["**/.*"],
//   // appDirectory: "app",
//   // assetsBuildDirectory: "public/build",
//   // serverBuildPath: ".netlify/functions-internal/server.js",
//   // publicPath: "/build/",
// };

/**
 * @type {import('@remix-run/dev/config').AppConfig}
 */
 module.exports = {
  appDirectory: "app",
  browserBuildDirectory: "public/build",
  publicPath: "/build/",
  serverBuildDirectory: "build",
  devServerPort: 8002
};