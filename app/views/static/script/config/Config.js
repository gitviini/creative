const preferences = JSON.parse(document.querySelector(".preferences").value)
const form_update_user = document.querySelector(".container_update_user form")
const deleteUser = document.querySelector(".deleteUser")

const path = window.location.href
const timeout = 2500

//* SETTING USER INPUTs
const nameInput = form_update_user.querySelector("input[name='name']")
nameInput.value = preferences.name

//* UPDATE USER's PREFERENCES
form_update_user.onsubmit = async (event) => {
    event.preventDefault()

    const button = form_update_user.querySelector("button")
    button.classList.add("active")
    //TODO Update changes user data

    const res = await fetch(path, {
        method: "PUT",
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({ name: nameInput.value })
    })

    button.classList.remove("active")

    const json = await res.json().catch(() => { })

    if (json) {
        toastMessage(json)
    }
    else if (res.ok) {
        toastMessage({ message: "Usuário atualizado com sucesso", mode: "success" })
    }
}

//* DELETE USER ACCOUNT
deleteUser.onclick = async () => {
    deleteUser.classList.add("active")

    const res = await fetch(path, {
        method: "DELETE",
    })

    deleteUser.classList.remove("active")

    try {
        const json = await res.json()
        toastMessage(json)
    }
    catch (err) { console.log(err) }

    if (res.ok) {
        setTimeout(() => {
            window.location.href = "/logout"
        }, timeout)
    }
}