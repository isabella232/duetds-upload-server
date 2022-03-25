const { getConfig, getEnv, getArgs } = require("../helpers/getEnv.js")
const { parse } = require("../helpers/loadGitignore.js")
const chalk = require("chalk")
const config = getConfig()
const path = require("path")
const args = getArgs()
const env = getEnv()
const nodemon = require("nodemon")
// function that loads  .gitignore from filesystem into an array

process.title = config.koaProcessName + "-chokidar"

let watcher

// log colourful messages to cli
console.log(chalk.bold.green("Starting server..."))
// log configuration object
console.log(chalk.bold.green("Configuration:"), JSON.stringify(config, null, 2))

const settings = {
  script: "src/server/koa-server.js",
  ext: "js json ts tsx html jsx",
  ignore: parse(path.resolve(config.lernaRoot, ".gitignore")),
  watch: config.watch === true ? Object.values(config.watchPaths) : "src",
  env: {
    NODE_ENV: config.env,
  },
}

nodemon(settings)

nodemon
  .on("start", function () {
    console.log("App has started")
  })
  .on("quit", function () {
    console.log("App has quit")
    process.exit()
  })
  .on("restart", function (files) {
    console.log("App restarted due to: ", files)
  })
  .on("crash", function () {
    console.error("App has crashed!")
  })

console.log(chalk.bold.blue("watching:"), JSON.stringify(settings.watch, null, 2))
