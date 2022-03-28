
module.exports = {
  configName: "default",
  koaProcessName: "duet-koa",
  koaLog: process.env.CI ? false : true,
  chokidarProcessName: "duet-koa",
  env: "development",
  watch: false,
  port: process.env.PORT || process.env.WEBSITE_PORT || 8080,
  upload: true,
  uploadPath: "./uploads",
  uploadInstantDelete: true
}
