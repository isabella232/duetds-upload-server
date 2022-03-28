const defSettings = require("./default")
const watching = require("./watching")

const config = Object.assign(
  {},
  defSettings,
  {
    configName: "development",
    env: "development"
  },
  watching
)

// export config object via module.export
module.exports = config
