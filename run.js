// IMPORTs
import express from "express"
import { Server } from "socket.io"
import http from "http"
import { getPath } from "./utils.js"
import { InsertUser, FetchUser, DeleteUser } from "./app/controllers/DB.js"

// IMPORTs MIDDLEWAREs
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

//APP SETUP
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = 3000

/* InsertUser(
    {
        name: "vini",
        email: "gvinicius105@gmail.com",
        entitie: ""
    }
)
    .then((data) => console.log(data)) */

//middlewares
app.use(cookieParser())
app.use(favicon(getPath("/views/static/img/favicon.png")))
app.use(bodyParser.json())
app.use(express.static(getPath("/views/static/")))
app.use((req, res, next) => {
    !req.cookies['preferences'] && !(req.url == "/login" || req.url == "/signup") ? res.redirect("/login") : next()
})

//ROUTES

//LOGIN
app.route("/login")
    //get page
    .get((req, res) => {
        res.sendFile(getPath("/views/templates/login.html"))
    })
    //insert new user
    .post((req, res) => {
        req.body
    })


app.route("/signup")
    //get page
    .get((req, res) => {
        res.sendFile(getPath("/views/templates/signup.html"))
    })
    //insert new user
    .post((req, res) => {
        req.body
    })

app.route("/game")
    .get((req, res) => {
        res.sendFile(getPath("/views/templates/game.html"))
    })

//SOCKET MANAGER
io.on("connection", (socket) => {
    console.log(`connected:. ${socket.id}`)

    socket.on("disconnect", () => {
        console.log(`disconnected:. ${socket.id}`)
    })

    /* socket.emit("message",{message:"olá"}) */
});

server.listen(PORT, () => {
    console.log("\n\x1b[1mApp is running:. \x1b[95mhttp://localhost:" + PORT + "\x1b[m")
})

export default app