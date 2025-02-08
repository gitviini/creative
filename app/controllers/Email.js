import nodemailer from "nodemailer"
import { colorMessage } from "../../utils.js"

console.log(process.env.EMAIL_ADDRESS)

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
})

async function sendMail(options = {from: String, to: String, subject: String, text: String}){
    const errors = {content: Object, message: ""}
    const res = {content: Object, message:""}

    await transporter.sendMail(options, (error, info)=>{
        if(error){
            colorMessage("danger","sendMail:." +error)
            errors.message = "Falha ao enviar email"
        }
        else{
            colorMessage("success","sendMail:."+info.response)
            res.message = "Email enviado para "+options.to
        }
    })

    return {res, errors}
}


export {sendMail}