// IMPORTs
import express from "express"
import { Server } from "socket.io"
import http from "http"
import { getPath } from "./utils.js"
import { InsertUser, validateAccount, FetchUser, DeleteUser } from "./app/controllers/DB.js"
import { colorMessage } from "./utils.js"
import { sendMail } from "./app/controllers/Email.js"

// IMPORTs MIDDLEWAREs
import helmet from "helmet"
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

//APP SETUP
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = 3000
const urls = {
    logged: ["/game", "/config", "/logout"],
}
const secretKey = "#pP#*ndZ9gqEF2S"

//middlewares
app.use(helmet({contentSecurityPolicy: false}))
app.use(cookieParser(secretKey))
app.use(favicon(getPath("/views/static/img/favicon.png")))
app.use(bodyParser.json())
app.use(express.static(getPath("/views/static/")))
app.use((req, res, next) => {
    if(req.cookies["preferences"] && !urls.logged.includes(req.url)){
        res.redirect("/game")
    }
    else if(!req.cookies["preferences"] && urls.logged.includes(req.url)){
        res.redirect("/login")
    }
    else {
        next()
    }
})

//ROUTES

//LOGIN
app.route("/login")
    //get page
    .get((req, res) => {
        res.sendFile(getPath("/views/templates/login.html"))
    })
    //insert new user
    .post((req, res, next) => {
        const { name, email } = req.body

        FetchUser({name: name, email: email})
        .then((data)=>{
            if(data.errors.message){
                res.status(500).json({message:data.errors.message,mode:"danger"})
            }
            else if(!data.res.content.validateAccount){
                res.status(200).json({message:data.res.message,mode:"warning"})
            }
            else{
                res.cookie("preferences", `{"name":"${name}","email":"${email}"}`, { maxAge: 3600000 })
                res.sendStatus(200)
            }
        
        })

    })

//SIGNUP
app.route("/signup")
    //get page
    .get((req, res) => {
        res.sendFile(getPath("/views/templates/signup.html"))
    })
    //insert new user
    .post((req, res) => {
        const { name, email } = req.body

        InsertUser({name: name,email: email,entitie: ""})
            .then((dataUser) => {
                if(dataUser.errors.message){
                    res.status(500).json({message:dataUser.errors.message, mode:"danger"})
                }
                else{
                    const validateCode = dataUser.res.content["validateCode"]
                    sendMail({
                        from:process.env.EMAIL_ADDRESSS,
                        to: email,
                        subject: "Validação da conta",
                        text: "código de validação: "+validateCode
                    })
                    .then((data)=>{
                        if(data.errors.message){
                            res.status(500).json({message:data.errors.message, mode:"danger"})
                        }
                        else{
                            res.status(200).json({message:data.res.message, mode:"success"})
                        }
                    })
                }
            })
    })

//VALIDATE WITH CODE
app.route("/validate/:name")
    .get((req, res)=>{
        res.sendFile(getPath("/views/templates/validateCode.html"))
    })
    //account validate with code
    .post((req,res)=>{
        const name = req.params.name
        const {validateCode} = req.body

        validateAccount({
            name: name,
            validateCode: validateCode
        })
        .then((data)=>{
            if(data.errors.message){
                res.status(500).json({message:data.errors.message, mode:"danger"})
            }
            else if(!data.res.content.validateAccount){
                res.status(200).json({message:data.res.message, mode:"warning"})
            }
            else{
                res.status(200).json({message:data.res.message, mode:"success"})
            }
        })
    })

//LOGOUT
app.route("/logout")
    .get((req, res) => {
        res.clearCookie("preferences")
        res.redirect("/login")
    })

//GAME
app.route("/game")
    .get((req, res) => {
        res.sendFile(getPath("/views/templates/game.html"))
    })

//SOCKET MANAGER
io.on("connection", (socket) => {
    colorMessage("success",`connected:. ${socket.id}`)

    socket.on("disconnect", () => {
        colorMessage("warning",`disconnected:. ${socket.id}`)
    })

    /* socket.emit("message",{message:"olá"}) */
});

server.listen(PORT, () => {
    console.log("\n\x1b[1mApp is running:. \x1b[95mhttp://localhost:" + PORT + "\x1b[m")
})