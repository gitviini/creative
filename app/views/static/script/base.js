//* ColorScheme Prefer User
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches
colorScheme ? document.body.classList.add("dark") : document.body.classList.remove("dark")

//* Logo configure
try{
    const logo = document.querySelector(".logo")
    colorScheme ? logo.src = "/img/dark.png" : logo.src = "/img/light.png"
}catch(err){}

//* Menu
try{
    const toggleMenu = document.querySelector(".toggleMenu")
    const closeMenu = document.querySelector(".closeMenu")
    const containerMenu = document.querySelector(".containerMenu")
    
    toggleMenu.onclick = () => containerMenu.classList.add("open")
    closeMenu.onclick = () => containerMenu.classList.remove("open")
}
catch(err){}
