import { PrismaClient } from "@prisma/client"
import { colorMessage } from "../../utils.js"
import { generate } from "generate-password"

const prisma = new PrismaClient()

async function InsertUser(user = { name: String, email: String, entitie: String, validateCode: String, validateAccount: Boolean }) {
    user.validateCode = generate({ length: 6, numbers: true })
    user.validateAccount = false

    const errors = { content: Object, message: "" }
    const res = { content: Object }
    try {
        const data = await FetchListNames()
        const list = data.res.content
        let exists = false
        for (let n = 0; n < list.length; n++) {
            if (user.email == list[n]?.email || user.name == list[n]?.name) {
                exists = true
            }
        }

        if (!exists) {
            const newUser = await prisma.user.create({ data: user, select: { name: true, validateCode: true } })
            res.content = newUser
        }
        else {
            errors.message = "Usuário ou Email já cadastrado"
        }
    }
    catch (err) {
        errors.content = err
        errors.message = "Falha ao criar novo usuário"
        colorMessage("danger", "InsertUser:. " + err)
    }
    return { res, errors }
}

async function validateAccount(user = { name: String, validateCode: String }) {
    const errors = { content: Object, message: "" }
    const res = { content: Object, message: "" }
    try {

        const fetchuser = await prisma.user.findUnique({ where: { name: user.name }, select: { validateCode: true } })

        if (fetchuser.validateCode == user.validateCode) {
            const updateUser = await prisma.user.update({ where: { name: user.name }, data: { validateAccount: true } })

            res.message = "Usuário autenticado"
        }
        else {
            res.message = "Código incorreto"
        }
    }
    catch (err) {
        errors.content = err
        errors.message = "Falha ao conectar com o banco"
        colorMessage("danger", "validateAccount:. " + err)
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
        errors.message = "Falha ao conectar-se ao banco de dados"
        colorMessage("danger", "FetchListNames:. " + err)
    }

    return { res, errors }
}

async function FetchUser(mode = "user", user = { name: String, email: String }) {
    const errors = { content: Object, message: "" }
    const res = { content: Object, message: "" }

    const select = (mode == "code" ? { validateCode: true } : { name: true, email: true, validateAccount: true })

    try {
        const data = await FetchListNames()
        const list = data.res.content
        let exists = false
        for (let n = 0; n < list.length; n++) {
            if (user.email == list[n]?.email || user.name == list[n]?.name) {
                exists = true
            }
        }
        if (exists) {
            res.content = await prisma.user.findUnique({ where: { name: user.name, email: user.email}, select: select })
            errors.message = (!res.content ? "Nome ou Email incorretos" : "")
            res.message = (res.content?.validateAccount == false ? "Usuário não validado" : "")
        }
        else {
            errors.message = "Usuário não cadastrado"
        }
    }
    catch (err) {
        errors.content = err
        errors.message = "Falha ao conectar-se ao banco de dados"
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
        errors.message = "Falha ao deletar usuário"
        colorMessage("danger", "DeleteUser:. " + err)
    }
    return { res, errors }
}

export { InsertUser, validateAccount, FetchListNames, FetchUser, DeleteUser }