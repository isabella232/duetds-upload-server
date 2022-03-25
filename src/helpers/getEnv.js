const fs = require("fs")
const path = require("path")
const env = process.env.NODE_ENV || "development"
const dash = require("dashargs")
const args = dash.argv()

const baseConfig = path.resolve("config", `${env}.js`)
const envConfig = require(baseConfig)

// function that gets NODE_ENV from node environment and defaults to development if nothing is found
const getEnv = () => {
  return env
}

const getConfig = () => {
  return envConfig
}

//export all functions above in module.exports
module.exports = {
  getEnv,
  getConfig,
  getArgs: dash.argv,
}
