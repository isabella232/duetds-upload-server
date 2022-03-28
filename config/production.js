const defSettings = require("./default")
const watching = require("./watching")
const path = require("path")
const getDir = item => path.resolve(__dirname, "..", "..", item)

const config = Object.assign(
  {},
  defSettings,
  {
    configName: "production",
    env: "production",
    koaLog: false
  },
  watching
)

// export config object via module.export
module.exports = config
