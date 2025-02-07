function colorMessage(mode = "danger" | "warning" | "success", text = "") {
    switch (mode) {
        case "danger":
            text = `\x1b[1;31m${text}\x1b[m`
            break
        case "warning":
            text = `\x1b[1;33m${text}\x1b[m`
            break
        case "success":
            text = `\x1b[1;32m${text}\x1b[m`
            break
        default:
            console.log(`colorMessage:. caso "${mode}" não existe.`)
            break
    }
    console.log(text)
}

function getPath(filePath = "") {
    return import.meta.dirname + "/app/" + filePath
}

export {colorMessage, getPath}