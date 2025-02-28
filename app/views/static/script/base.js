//* ContextMenu
window.oncontextmenu = (e) => {
    // Prevent defaut menu
    e.preventDefault()
}

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
    // Set image according to device's theme
    colorScheme ? logo.src = "/img/dark.png" : logo.src = "/img/light.png"
} catch (err) { }

//* Menu
try {
    const toggleMenu = document.querySelector(".toggleMenu")
    const closeMenu = document.querySelector(".closeMenu")
    const containerMenu = document.querySelector(".containerMenu")

    // Open menu
    toggleMenu.onclick = () => containerMenu.classList.add("open")
    // Close menu
    closeMenu.onclick = () => containerMenu.classList.remove("open")
    // If mouse leave menu, It'll close.
    containerMenu.onmouseleave = () => containerMenu.classList.remove("open")
}
catch (err) { }

//* Container Popup
try {
    const containerPopup = document.querySelector(".containerPopup")
    containerPopup.querySelector(".close").onclick = () => containerPopup.classList.remove("open")
}
catch (err) { }