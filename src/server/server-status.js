const chalk = require("chalk")

// get ip addresse from network interface
const { networkInterfaces } = require("os")

const ip = Object.values(networkInterfaces())
  .flat()
  .find(i => i.family == "IPv4" && !i.internal).address

//fancy terminal logging to inform of status
const logStatus = (port, root, config) => {
  console.log(chalk.bgBlue.black("  Starting Koa Dev server on  "))
  console.log(chalk.blue(`  current root: ${root}`))
  console.log(chalk.blue(`  logging: ${config.koaLog === true && !process.env.CI ? "enabled" : "disabled"}`))
  console.log(chalk.yellow(`    `))

  console.log(chalk.yellow(`  ----- upload server runnning at: -----  `))
  console.log(chalk.green(`  http://localhost:${port}/uploads/  `))
  console.log(chalk.green(`  http://0.0.0.0:${port}/uploads/  `))
  console.log(chalk.green(`  http://${ip}:${port}/uploads/  `))
  console.log(chalk.yellow(`    `))
}

module.exports = {
  logStatus,
  ip,
}
