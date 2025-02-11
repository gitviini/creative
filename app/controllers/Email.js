import nodemailer from "nodemailer"
import { colorMessage } from "../../utils.js"

if (!process.env.EMAIL_ADDRESS) {
    colorMessage("danger", "Email.js:. envirioment's variables don't configureds")
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})

async function sendMail(options = { from: string, to: string, subject: string, html: "" }, code=String) {
    options.html = `\
<div>\
<h1>Olá, Novo usuário.</h1>\
<p>Aqui está o código de validação:</p>\
<h3>${code}</h3>\
</div>`

    const errors = { content: Object, message: "" }
    const res = { content: Object, message: "" }

    const info = await transporter.sendMail(options)

    if (!info) {
        errors.message = "Falha ao enviar email"
    }
    else {
        colorMessage("success", "sendMail:." + info?.response)
        res.message = "Email enviado para " + options.to
    }

    return {res, errors}
}


export { sendMail }