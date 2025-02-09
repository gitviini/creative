//* IMPORTs
import express from "express"
import { Server } from "socket.io"
import http from "http"
import { getPath } from "./utils.js"
import { InsertUser, validateAccount, FetchUser, DeleteUser } from "./app/controllers/DB.js"
import { colorMessage } from "./utils.js"
import { sendMail } from "./app/controllers/Email.js"

//* IMPORTs MIDDLEWAREs
import nunjucks from "nunjucks"
import helmet from "helmet"
import favicon from "serve-favicon"
import bodyParser from "body-parser"
import cookieParser from "cookie-parser"

//* APP SETUP
const app = express()
const server = http.createServer(app)
const io = new Server(server)
const PORT = 3000
const urls = {
    logged: ["/", "/config", "/logout"],
}
const secretKey = "#pP#*ndZ9gqEF2S"
app.set("view engine", "njk")

//* MIDDLEWAREs
app.use(helmet({ contentSecurityPolicy: false }))
nunjucks.configure(getPath("/views/templates/"), { autoescape: true, express: app, watch: true })
app.use(cookieParser(secretKey))
app.use(favicon(getPath("/views/static/img/favicon.png")))
app.use(bodyParser.json())
app.use(express.static(getPath("/views/static/")))
app.use((req, res, next) => {
    if (req.cookies["preferences"] && !urls.logged.includes(req.url)) {
        res.redirect("/")
    }
    else if (!req.cookies["preferences"] && urls.logged.includes(req.url)) {
        res.redirect("/login")
    }
    else {
        next()
    }
})

//* ROUTES
//* LOGIN
app.route("/login")
    //? get page
    .get((req, res) => {
        res.render("login.html")
    })
    //? insert new user
    .post(async (req, res) => {
        const { name, email } = req.body

        const data = await FetchUser("user",{ name: name, email: email })

        if (data.errors.message) {
            res.status(500).json({ message: data.errors.message, mode: "danger" })
        }
        else if (!data.res.content.validateAccount) {
            res.status(200).json({ message: data.res.message, mode: "warning" })
        }
        else {
            res.cookie("preferences", `{"name":"${name}","email":"${email}"}`, { maxAge: 3600000 })
            res.sendStatus(200)
        }
    })

//* SIGNUP
app.route("/signup")
    //? get page
    .get((req, res) => {
        res.render("signup.html")
    })
    //? insert new user
    .post(async (req, res) => {
        const { name, email } = req.body

        const dataUser = await InsertUser({ name: name, email: email, entitie: "" })

        if (dataUser.errors.message) {
            res.status(500).json({ message: dataUser.errors.message, mode: "danger" })
        }
        else {
            const validateCode = dataUser.res.content["validateCode"]
            const emailData = await sendMail({
                from: process.env.EMAIL_ADDRESSS,
                to: email,
                subject: "Validação da conta",
            }, validateCode)

            if (emailData.errors.message) {
                res.status(200).json({ message: emailData.errors.message, mode: "warning" })
            }
            else {
                res.status(200).json({ message: emailData.res.message, mode: "success" })
            }
        }
    })

//* ACCOUNT VALIDATION WITH CODE
app.route("/validate/:name/:email")
    //? get page
    .get((req, res) => {
        const email = req.params.email
        res.render("validateCode.html", { email: email })
    })
    //? account validate with code
    .post(async (req, res) => {
        const name = req.params.name
        const { validateCode } = req.body

        
        const data = await validateAccount({
            name: name,
            validateCode: validateCode
        })

        if (data.errors.message) {
            res.status(500).json({ message: data.errors.message, mode: "danger" })
        }
        else if (!data.res.content.validateAccount) {
            res.status(200).json({ message: data.res.message, mode: "warning" })
        }
        else {
            res.status(200).json({ message: data.res.message, mode: "success" })
        }

    })
    //? code resend
    .put(async (req, res) => {
        const email = req.params?.email
        const name = req.params?.name
        const data = await FetchUser("code", { name: name, email: email })

        const { validateCode } = data.res.content
        const emailData = await sendMail({
            from: process.env.EMAIL_ADDRESSS,
            to: email,
            subject: "Validação da conta",
        }, validateCode)

        if (emailData.errors.message) {
            res.status(200).json({ message: emailData.errors.message, mode: "warning" })
        }
        else {
            res.status(200).json({ message: emailData.res.message, mode: "success" })
        }
    })

//* LOGOUT
app.route("/logout")
    //? get page
    .get((req, res) => {
        res.clearCookie("preferences")
        res.redirect("/login")
    })

//* GAME
app.route("/")
    //? get page
    .get((req, res) => {
        res.render("game.html")
    })

//* SOCKET MANAGER
io.on("connection", (socket) => {
    colorMessage("success", `connected:. ${socket.id}`)

    socket.on("disconnect", () => {
        colorMessage("warning", `disconnected:. ${socket.id}`)
    })

    socket.emit("message",{message:"Usuário logado.",mode:"success"})
});

server.listen(PORT, () => {
    console.log("\n\x1b[1mApp is running:. \x1b[95mhttp://localhost:" + PORT + "\x1b[m")
})