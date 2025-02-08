const form = document.querySelector("form")

form.onsubmit = (event) => {
    event.preventDefault()

    const mode = form.getAttribute("name")

    const path = window.location.href
    const name = form.children[0].value
    const email = form.children[1].value

    if (mode == "login") {
        fetch(path, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ name: name, email: email })
        })
            .then((res) => {
                if (res.json) {
                    const json = res.json()
                    toastMessage(json?.message)
                    if(res.status == 200){
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                    }
                }
            })
        return
    }
    else if (mode == "signup") {
        fetch(path, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ name: name, email: email })
        })
            .then(async (res) => {
                if (res.json) {
                    const json = await res.json()
                    toastMessage("success", json?.message)
                    if(res.status == 200){
                        setTimeout(() => {
                            window.location.reload()
                        }, 1000);
                    }
                }
            })
        return
    }
    else if (mode == "validateCode") {
        const code = form.children[0].value

        const nameCookie = getCookie("name")

        fetch(path, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({name: nameCookie, validateCode: code })
        })
        .then(async (res) => {
            if(res.json){
                const json = await res.json()
                toastMessage("success",json?.message)
                if(res.status == 200){
                    setTimeout(() => {
                        window.location.reload()
                    }, 1000);
                }
            }
        })
    }
}

function getCookie(nameCookie = "") {
    const cookies = document.cookie.split("; ")
    let res = ""
    cookies.forEach(cookie => {
        const tmp = cookie.split("=")
        if (tmp[0] == nameCookie) {
            res = tmp[1]
        }
    })
    console.log(res)
    return res
}