const exec = require("child_process").execSync

module.exports = (command /*: string */) => {
  const std = exec(command)
  return std.toString()
}
