const defSettings = require("./default")
const watching = require("./watching")

const config = Object.assign(
  {},
  defSettings,
  {
    configName: "development",
<<<<<<< HEAD
    env: "development",
=======
    env: "development"
>>>>>>> dc81f63 (wip)
  },
  watching
)

// export config object via module.export
module.exports = config
