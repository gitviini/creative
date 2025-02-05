// Run main tasks and settings
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require("socket.io")
const io = new Server(server)
const PORT = 3000

function getPath(filePath = "") {
    return __dirname + "/app/" + filePath
}

//middlewares
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
/* const morgan = require('morgan') */
app.use(favicon(getPath("/views/static/img/favicon.png")))
/* app.use(morgan("short")) */
app.use(bodyParser.json())
app.use(express.static(getPath("/views/static/")))

//route
app.get('/', (req, res) => {
    res.sendFile(getPath("/views/templates/index.html"))
})

io.on('connection', (socket) => {
    console.log(`connected:. ${socket.id}`);

    socket.on("disconnect",()=>{
        console.log(`disconnected:. ${socket.id}`)
    })

    /* socket.emit("message",{message:'olá'}) */
});

server.listen(PORT, () => {
    console.log("\n\x1b[1mApp is running:. \x1b[95mhttp://localhost:" + PORT + "\x1b[m")
})