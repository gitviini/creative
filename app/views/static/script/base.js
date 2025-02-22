//* ColorScheme Prefer User 
const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
colorScheme.matches ? document.body.classList.add("dark") : document.body.classList.remove("dark")

console.log(colorScheme)

//* Menu
try{
    const toggleMenu = document.querySelector(".toggleMenu")
    const closeMenu = document.querySelector(".closeMenu")
    const containerMenu = document.querySelector(".containerMenu")
    
    toggleMenu.onclick = () => containerMenu.classList.add("open")
    closeMenu.onclick = () => containerMenu.classList.remove("open")
}
catch(err){}