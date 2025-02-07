import { PrismaClient } from "@prisma/client"
import { colorMessage } from "../../utils.js"

const prisma = new PrismaClient()

async function InsertUser(user = { name: String, email: String, entitie: String }) {
    const errors = { content: Object, message: "" }
    const res = { content: Object }
    try {
        const data = await FetchListNames()
        const list = data.res.content
        let exists = false
        for(let n = 0; n < list.length; n++){
            if(user.email == list[n]?.email || user.name == list[n]?.name){
                exists = true
            }
        }
        
        if(!exists){
            const newUser = await prisma.user.create({ data: user })
            res.content = newUser
        }
        else{
            errors.message = "Usuário ou Email já cadastrado"
        }
    }
    catch (err) {
        errors.content = err
        errors.message = "Falha ao criar novo usuário."
        colorMessage("danger", "InsertUser:. " + err)
    }
    return { res, errors }
}

async function FetchListNames() {
    const errors = { content: Object, message: "" }
    const res = { content: Array }
    try {
        const listNames = await prisma.user.findMany({ select: { email: true, name: true } })
        res.content = listNames
    }
    catch (err) {
        errors.content.push(err)
        errors.message = "Falha ao conectar-se ao banco de dados."
        colorMessage("danger", "FetchListNames:. " + err)
    }

    return { res, errors }
}

async function FetchUser(user = { name: String }) {
    const errors = { content: Object, message: "" }
    const res = { content: Object }

    try {
        const user = await prisma.user.findUnique({ where: { name: user.name } })
        res.content = user
    }
    catch (err) {
        errors.content = err
        errors.message = "Falha ao conectar-se ao banco de dados."
        colorMessage("danger", "FetchUser:. " + err)
    }

    return { res, errors }
}

async function DeleteUser(user = { name: String, email: String }) {
    const errors = { content: Object, message: "" }
    const res = { content: Object }
    try {
        const deletedUser = await prisma.user.delete({ where: { name: user.name } })
        res.content = deletedUser
    }
    catch (err) {
        errors.content = err
        errors.message = "Falha ao deletar usuário."
        colorMessage("danger", "DeleteUser:. " + err)
    }
    return { res, errors }
}

export { InsertUser, FetchListNames, FetchUser, DeleteUser }