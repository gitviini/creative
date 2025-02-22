const toggleMenu = document.querySelector(".toggleMenu")
const closeMenu = document.querySelector(".closeMenu")
const containerMenu = document.querySelector(".container_menu")

toggleMenu.onclick = () => containerMenu.classList.add("open")
closeMenu.onclick = () => containerMenu.classList.remove("open")