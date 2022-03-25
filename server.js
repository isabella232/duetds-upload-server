const { getConfig } = require("./src/helpers/getEnv.js")
const { logStatus } = require("./src/server/server-status.js")
const config = getConfig()

process.title = config.koaProcessName

//require libraries
const koa = require("koa")
const serve = require("koa-static")
const mount = require("koa-mount")
const cors = require("@koa/cors")
const koaBody = require("koa-body")
const koaRouter = require("koa-router")
const koaLogger = require("koa-colorful-logger")

const fs = require("fs")
const EventEmitter = require("events")
const { PassThrough } = require("stream")
const path = require("path")
const chalk = require("chalk")
const { networkInterfaces } = require("os")


const logger = new koaLogger({
  /**
   * Only when level exceed your setting will log info be output.
   * Priority: DEBUG < INFO < WARNING < ERROR < CRITICAL
   */
  outputLevel: "INFO",
  /**
   * The format of the prefix.
   * Default is: '[level][time] '
   * Available variables:
   * - [level]
   * - [time]
   */
  prefixFormat: "[level][time] ",
  /**
   * A function that should return a string for message.
   * It will receive two args: 'ctx` and 'costTime'.
   */
  msgFormatFunction: function (ctx, costTime) {
    return `${ctx.method} ${ctx.originalUrl} - ${ctx.status} - ${costTime}ms - ${ctx.ip}`
  },
})

//setup constants
const router = new koaRouter()
const port = config.port
const reloadScriptPath = path.join(__dirname, "client")

//fancy log of current status
logStatus(port, __dirname, config)

// set header function
const setHeader = (ctx, next) => {
  ctx.set("Access-Control-Allow-Origin", "*")
  ctx.set("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  ctx.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  ctx.set("Access-Control-Allow-Credentials", "true")
  ctx.set("Cache-Control", "max-age=0, no-store, no-cache, must-revalidate")
  ctx.set("Pragma", "no-cache")
  ctx.set("Expires", 0)
  return next
}


// Simple liveliness / isUp handler that responds with {status: "ok"}
async function sendOK(ctx, next) {
  await next()
  if (ctx.request.url == "/" || ctx.request.url == "") {
    ctx.body = { status: "ok" }
    ctx.status = 200
  }
}

//dummy implementation of a serverside upload file handler, this one just returns a fake object to fullfill client js needs
async function getUploads(ctx, next) {
  await next()
  const file = ctx.request.files.file
  const { key, url } = await uploadFile({
    fileName: file.name,
    filePath: file.path,
    fileType: file.type,
  })
  ctx.body = { key, url }
}

//in order not to clobber a machines available diskspace we clean up after an upload
async function uploadFile(data) {
  //lets clean up after us again
  const pathToFile = path.join(data.filePath, data.fileName)
  if (fs.existsSync(pathToFile) && config.uploadInstantDelete) {
    try {
      fs.unlinkSync(pathToFile)
    } catch (e) {
      // file doesn't exist, no permissions, etc..
      // full list of possible errors is here
      // http://man7.org/linux/man-pages/man2/unlink.2.html#ERRORS
      console.log(e)
    }
  }
  return { key: Date.now(), url: data.filePath }
}

// setup the KOA webserver
let app = new koa()
if (config.koaLog) {
  app.use(logger.middleware())
}
//enable cors
app.use(cors())

//this file endpoint can respond with various responses depending on what the file is called
//it looks for any HTTP status codes in the filename and will respond with the ones it knows below
router.post("/upload", async ctx => {
  const file = ctx.request.files.file

  const fileMetaData = ctx.request.body

  const fileObject = {
    fileName: file.name,
    filePath: file.path,
    fileType: file.type,
    fileMetaData: fileMetaData,
  }
  const { key, url } = await uploadFile(fileObject)

  const body = { key, url }

  if (file.name.indexOf("500") >= 0) {
    console.log("forcing a: ", 500)
    body.error = {
      message: "Error 500, occured",
      type: 500,
    }
    ctx.status = 500
  }
  if (file.name.indexOf("400") >= 0) {
    console.log("forcing a: ", 400)
    body.error = {
      message: "Error 400, occured",
      type: 400,
    }
    ctx.status = 400
  }
  if (file.name.indexOf("413") >= 0) {
    console.log("forcing a: ", 413)
    body.error = {
      message: "Error 413, occured",
      type: 413,
    }
    ctx.status = 413
  }
  if (file.name.indexOf("415") >= 0) {
    console.log("forcing a: ", 415)
    body.error = {
      message: "Error 415, occured",
      type: 415,
    }
    ctx.status = 415
  }
  if (file.name.indexOf("499") >= 0) {
    console.log("forcing a: ", 499)
    body.error = {
      message: "Error 499, occured",
      type: 499,
    }
    ctx.status = 499
  }
  if (file.name.indexOf("404") >= 0) {
    body.error = {
      message: "Error 404, occured",
      type: 404,
    }
    console.log("forcing a: ", 404)
    ctx.status = 404
  }
  ctx.body = body
  console.log(body)
})

// endpoint to receive and respond to delete requests
router.delete("/uploads", async ctx => {
  console.log("received delete request")
  ctx.status === 202
  ctx.body = "ok"
})

// We enable multipart body parsing
app.use(koaBody({ multipart: true, parsedMethods: ["POST", "GET", "DEL"] }))
app.use(router.routes())
app.use(router.allowedMethods())

// endpoint to tes uploads from duet-upload
app.use(mount("/uploads", getUploads))

// Middleware that adds the header to all requests
app.use(async (ctx, next) => {
  await next()
  setHeader(ctx, next)
})

// Debugging point
app.use(async (ctx, next) => {
  // const start = Date.now()

  return next().then(() => {
    /*
    // debug
    const ms = Date.now() - start;
    console.log(`${ctx.method}(${ms} ms): ${ctx.url}
resolved to:
${JSON.stringify(compRequest,null,2)}`);
  */
  })
})


// When onchange fires it will kill the service, catch the kill signal and fireoff an SSE event first
process.on("SIGTERM", function () {
  events.emit("data", JSON.stringify({ date: new Date(), reloading: true }))
  setTimeout(() => {
    console.log(chalk.blue(`SIGTERM: Koa closed`))
    process.exit(0)
  }, 1)
  return 0
})

process.on("exit", function () {
  // You need to use a synchronous, blocking function, here.
  // Not streams or even console.log, which are non-blocking.
  if (livelinessResult) {
    console.log(chalk.blue(`exit:  Koa exited `))
  }
})

process.on("uncaughtException", function (err) {
  if (err.code === "EADDRINUSE") {
    if (testIfAllreadyRunning()) {
      console.log(chalk.blue(`EADDRINUSE:  Koa exited (there's already a Koa instance running on port ${port})  `))
    } else {
      console.log(chalk.yellow(`EADDRINUSE:  Koa exited (there's already something running on port ${port})  `))
    }
    process.exit(0)
  } else {
    // console.log(err)
    // process.exit(1)
  }
})

app.listen(port)
