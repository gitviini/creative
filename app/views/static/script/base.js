//* ContextMenu
window.oncontextmenu = (e) => {
    // Prevent defaut menu
    e.preventDefault()
}

//* ColorScheme Prefer User
// Handler function to set colorscheme
function handlerColorScheme(colorScheme) {
    if (colorScheme) {
        Coloris({
            themeMode: 'dark',
            alpha: true,
            wrap: true,
            defaultColor: '#000000',
        });
        document.body.classList.add("dark")
    } else {
        Coloris({
            themeMode: 'light',
            alpha: true,
            wrap: true,
            defaultColor: '#000000',
        });
        document.body.classList.remove("dark")
    }
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
    const close = document.createElement("div")
    close.setAttribute("class", "close popup")
    close.innerHTML = '<i class="fa fa-close fa-2x"></i><span>Fechar</span>'

    close.onclick = () => {
        const listChildren = containerPopup.children
        for (let n = 1; n < listChildren.length; n++) {
            containerPopup.removeChild(listChildren[n])
        }
        containerPopup.classList.remove("open")
    }

    containerPopup.appendChild(close)
}
catch (err) { }