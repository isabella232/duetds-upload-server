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
<<<<<<< HEAD
    koaLog: false,
    watchPaths: {
      components: getDir("components/lib/"),
      tokens: getDir("tokens/lib/"),
      icons: getDir("icons/lib/"),
      docs: getDir("docs/dist/"),
      css: getDir("css/lib/"),
      server: getDir("server/src/"),
    },
=======
    koaLog: false
>>>>>>> dc81f63 (wip)
  },
  watching
)

// export config object via module.export
module.exports = config
