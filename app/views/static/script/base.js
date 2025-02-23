//* ColorScheme Prefer User
// Handler function to set colorscheme
function handlerColorScheme(colorScheme) { 
    colorScheme ? document.body.classList.add("dark") : document.body.classList.remove("dark") 
}
// Instance of window.matchMedia
const colorSchemeInstance = window.matchMedia('(prefers-color-scheme: dark)')
// First set colorscheme and detect change of system
handlerColorScheme(colorSchemeInstance.matches)
colorSchemeInstance.onchange = (event) => handlerColorScheme(event.matches)


//* Logo configure
try {
    const logo = document.querySelector(".logo")
    colorScheme ? logo.src = "/img/dark.png" : logo.src = "/img/light.png"
} catch (err) { }

//* Menu
try {
    const toggleMenu = document.querySelector(".toggleMenu")
    const closeMenu = document.querySelector(".closeMenu")
    const containerMenu = document.querySelector(".containerMenu")

    toggleMenu.onclick = () => containerMenu.classList.add("open")
    closeMenu.onclick = () => containerMenu.classList.remove("open")
    containerMenu.onmouseleave = () => containerMenu.classList.remove("open")
}
catch (err) { }
