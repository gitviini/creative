const preferences = JSON.parse(document.querySelector(".preferences").value)

const update_user = document.querySelector(".container_update_user form")

//* SETTING USER INPUTs
const nameInput = update_user.children[0]
nameInput.value = preferences.name

//* UPDATE USER's PREFERENCES
update_user.onsubmit = (event) =>{
    event.preventDefault()
    //TODO Update changes user data
}
