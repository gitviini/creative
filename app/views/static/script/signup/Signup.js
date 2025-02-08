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
            .then(async (res) => {
                const json = await res.json().catch(()=>{})
                if (json){
                    toastMessage(json?.mode, json?.message)
                    res.ok ? setTimeout(()=>window.location.href = "/validate/"+name, 1000) : {}
                }
                else if (res.ok) {
                    setTimeout(() => {
                        window.location.href = "/game"
                    }, 1000);
                }
            })
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
                try{
                    if (res.json) {
                        const json = await res.json()
                        toastMessage(json?.mode, json?.message)
                        if (res.status == 200) {
                            setTimeout(() => {
                                window.location.href = "/validate/" + name
                            }, 1000);
                        }
                    }
                }
                catch(err){}
            })
    }
    else if (mode == "validateCode") {
        const code = form.children[0].value

        const nameCookie = getCookie("name")

        fetch(path, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ name: nameCookie, validateCode: code })
        })
            .then(async (res) => {
                if (res.json) {
                    const json = await res.json()
                    toastMessage(json?.mode, json?.message)
                    if (res.status == 200) {
                        setTimeout(() => {
                            window.location.href = "/login"
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