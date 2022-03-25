const dash = require("dashargs")
const args = dash.argv()

const config = {
  watch: args.watch || false,
}

// export config object via module.export
module.exports = config
