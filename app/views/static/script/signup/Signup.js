const form = document.querySelector("form")

const timeout = 2500

form.onsubmit = (event) => {
    event.preventDefault()

    const button = form.querySelector("button")
    button.classList.add("active")

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
                button.classList.remove("active")
                const json = await res.json().catch(()=>{})
                if (json){
                    toastMessage(json)
                    res.ok ? setTimeout(()=>window.location.href = `validate/${name}/${email}`, 1000) : {}
                }
                else if (res.ok) {
                    toastMessage({message:"Usuário autenticado com sucesso",mode:"success"})
                    setTimeout(() => {
                        window.location.href = "/game"
                    }, timeout);
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
                    button.classList.remove("active")
                    if (res.json) {
                        const json = await res.json()
                        toastMessage(json)
                        if (res.status == 200) {
                            setTimeout(() => {
                                window.location.href = `/validate/${name}/${email}`
                            }, timeout);
                        }
                    }
                }
                catch(err){}
            })
    }
    else if (mode == "validateCode") {
        const code = form.children[1].value

        fetch(path, {
            method: "POST",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ validateCode: code })
        })
            .then(async (res) => {
                button.classList.remove("active")
                if (res.json) {
                    const json = await res.json()
                    toastMessage(json)
                    if (res.status == 200) {
                        setTimeout(() => {
                            window.location.href = "/login"
                        }, timeout);
                    }
                }
            })
    }
}

async function codeResend(){
    const path = window.location.href

    fetch(path, {
        method: "PUT",
        headers:{
            "Content-type":"application/json",
        },
    })
    .then(async (res)=>{
        const json = await res.json()
        if(json){
            toastMessage(json)
        }
    })
}