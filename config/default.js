<<<<<<< HEAD
const path = require("path")
const findUp = require("find-up")
const lernaRoot = findUp.sync(
  directory => {
    const hasLerna = findUp.sync.exists(path.join(directory, "lerna.json"))
    return hasLerna && directory
  },
  { type: "directory" }
)

const getDir = item => path.resolve(lernaRoot, "packages", item)

=======
>>>>>>> dc81f63 (wip)
module.exports = {
  configName: "default",
  koaProcessName: "duet-koa",
  koaLog: process.env.CI ? false : true,
  chokidarProcessName: "duet-koa",
  env: "development",
  watch: false,
<<<<<<< HEAD
  port: 3334,
  upload: true,
  uploadPath: "./uploads",
  uploadInstantDelete: true,
  watchPaths: {
    components: getDir("components/src/"),
    tokens: getDir("tokens/src/"),
    fonts: getDir("fonts/src/"),
    icons: getDir("icons/src/"),
    docs: getDir("docs/src/"),
    css: getDir("css/src/"),
    server: getDir("server/src/"),
  },
  libPaths: {
    components: getDir("components/lib/"),
    tokens: getDir("tokens/lib/"),
    fonts: getDir("fonts/lib/"),
    icons: getDir("icons/lib/"),
    css: getDir("css/lib/"),
  },
  lernaRoot,
  prototypes: getDir("components/src/prototypes"),
  components: getDir("components/src/components"),
  duetBuild: getDir("components/lib/duet"),
=======
  port: process.env.PORT || 80,
  upload: true,
  uploadPath: "./uploads",
  uploadInstantDelete: true
>>>>>>> dc81f63 (wip)
}
