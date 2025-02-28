const positionMouse = document.querySelector(".positionMouse")
const containerTools = document.querySelector(".containerTools")
const containerFile = document.querySelector(".containerFile")
const canvasGrid = document.querySelector("canvas.gridBack")
const canvas = document.querySelector("canvas.drawFront")

class SpriteEditor {
    constructor(CanvasElement = HTMLCanvasElement, CanvasGrid = HTMLCanvasElement, ContainerTools = HTMLElement) {
        //* Set containers
        this.canvas = CanvasElement
        this.canvasGrid = CanvasGrid
        this.containerTools = ContainerTools

        //* Variables and infos
        this.ctx = this.canvas.getContext("2d")
        this.scale = 16

        //* Editor and image
        this.screen = {
            width: 16,
            height: 16
        }
        this.pixel = 1
        this.drawRecover = []

        //* Tool and tools list
        this.tools = [
            {
                mode: "paint",
                fill: "#000",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123462.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    this.ctx.fillStyle = this.tool.fill
                    this.ctx.fillRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                }
            },
            {
                mode: "eraser",
                fill: "#fff",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123513.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    this.ctx.clearRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                }
            },
            {
                mode: "paint roller",
                fill: "#000",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123528.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {

                }
            },
            {
                mode: "move",
                fill: undefined,
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123500.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    
                }
            },
        ]
        this.tool = this.tools[0]

        //* File and file features
        this.file = {
            name: "document",
        }

        this.fileFeatures = [
            {
                mode: "upload",
                icon: "https://cdn-icons-png.freepik.com/512/7039/7039815.png?ga=GA1.1.553086067.1740610280",
                action: () => {
                    const containerPopup = document.querySelector(".containerPopup")
                    const upload = document.createElement("file")
                    
                    containerPopup.classList.add("open")
                }
            },
            {
                mode: "save",
                icon: "https://cdn-icons-png.freepik.com/512/7039/7039737.png?ga=GA1.1.553086067.1740610280",
                action: () => {
                    this.save()
                    const img = this.drawRecover[this.drawRecover.length - 1]
                    const handlerLink = document.createElement("a")
                    handlerLink.href = img
                    handlerLink.download = this.file.name
                    handlerLink.click()
                }
            },
            {
                mode: "set",
                icon: "https://cdn-icons-png.freepik.com/512/7039/7039819.png?ga=GA1.1.553086067.1740610280",
                action: () => { }
            },
            {
                mode: "delete",
                icon: "https://cdn-icons-png.freepik.com/512/7039/7039822.png?ga=GA1.1.553086067.1740610280",
                action: () => { }
            },
        ]

        //* Init set properties
        this.getPixelSize()
        this.getColor()
        this.setContainerFile()
        this.getTools()
        this.getKeyBoard()

        //* Init
        this.resize()
        this.grid()
        this.getClick()
    }

    //* Get color in input 
    getColor() {
        const color = document.querySelector("input[type='color']")
        document.querySelector("label .color").style.backgroundColor = color.value
        color.onchange = (e) => {
            this.tool.fill = e.target.value
            document.querySelector("label .color").style.backgroundColor = e.target.value
        }
    }

    //* Get pixel size in input
    getPixelSize() {
        const pixelsize = document.querySelector("input[type='range'")
        document.querySelector("label[for='range']").innerHTML = `${this.pixel}px`
        pixelsize.onchange = (e) => {
            this.pixel = e.target.value
            document.querySelector("label[for='range']").innerHTML = `${this.pixel}px`
        }
    }

    setContainerFile() {
        const containerFileOptions = containerFile.querySelector(".containerFileOptions")

        this.fileFeatures.forEach(feature => {
            const div = document.createElement("div")
            div.setAttribute("class", "pressable tool")
            div.innerHTML += `<img src="${feature.icon}" alt="${feature.mode}"></img>`
            div.onclick = feature.action
            containerFileOptions.appendChild(div)
        })

        containerFile.querySelector(".select").onclick = () => {
            containerFileOptions.classList.add("open")
            containerTools.querySelector(".containerToolsOptions").classList.remove("open")
        }
        containerFileOptions.querySelector(".close").onclick = () => containerFileOptions.classList.remove("open")
    }

    //* Set init tool and selected tools
    setSelectTool(tool) {
        const selectTool = containerTools.querySelector(".select")
        selectTool.onclick = () => {
            containerTools.querySelector(".containerToolsOptions").classList.add("open")
            containerFile.querySelector(".containerFileOptions").classList.remove("open")
        }
        selectTool.querySelector("img").setAttribute("src", tool.icon)
        this.tool = tool
    }

    //* Get tools and push in containerTools
    getTools() {
        const containerToolsOptions = containerTools.querySelector(".containerToolsOptions")

        this.setSelectTool(this.tool)

        containerToolsOptions.querySelector(".close").onclick = () => containerToolsOptions.classList.remove("open")

        this.tools.forEach(tool => {
            const div = document.createElement("div")
            div.setAttribute("class", "pressable tool")
            div.innerHTML += `<img src="${tool.icon}" alt="${tool.mode}"></img>`
            div.onclick = () => {
                this.setSelectTool(tool)
            }
            containerToolsOptions.appendChild(div)
        })
    }

    //* Save canvas conteiner image
    save() {
        const img = new Image()
        img.src = this.canvas.toDataURL()
        this.drawRecover.push(img.src)
    }

    //* Recover image had saved before action (resize and another actions)
    recover() {
        const imgRecover = this.drawRecover[this.drawRecover.length - 1]
        this.ctx.drawImage(imgRecover, 0, 0)
    }

    //* Resize canvas conteiner and canvas grid
    resize() {
        this.canvasGrid.width = this.screen.width
        this.canvasGrid.height = this.screen.height
        this.canvasGrid.style.width = `${this.screen.width * this.scale}px`
        this.canvasGrid.style.height = `${this.screen.height * this.scale}px`
        this.canvas.width = this.screen.width
        this.canvas.height = this.screen.height
        this.canvas.style.width = `${this.screen.width * this.scale}px`
        this.canvas.style.height = `${this.screen.height * this.scale}px`
    }

    //* Get position mouse
    getPositionMouse(e) {
        if (e.touches) {
            this.tool.position = {
                x: Math.floor((e.touches[0].clientX - this.canvas.offsetLeft) / this.scale),
                y: Math.floor((e.touches[0].clientY - this.canvas.offsetTop) / this.scale)
            }
            console.log(this.tool.position)
        }
        else {
            this.tool.position = {
                x: Math.floor((e.x - this.canvas.offsetLeft) / this.scale),
                y: Math.floor((e.y - this.canvas.offsetTop) / this.scale)
            }
        }

        positionMouse.innerHTML = `x: ${this.tool.position.x}, y: ${this.tool.position.y}`
    }

    //* Handler to get click user and it do some action
    getClick() {
        const move = (e) => {
            this.getPositionMouse(e)
            this.mouseDown.progress ? this.tool.action() : {}
        }
        const init = (e) => {
            this.getPositionMouse(e)
            this.mouseDown = {
                target: e.target,
                progress: true,
                initPosition: this.tool.position
            }
            this.tool.action()
        }
        const end = (e) => {
            this.save()
            this.mouseDown.progress = false
        }

        this.canvas.addEventListener("touchmove", move)
        this.canvas.onmousemove = move
        this.canvas.addEventListener("touchstart", init)
        this.canvas.onmousedown = init
        this.canvas.addEventListener("touchend", end)
        this.canvas.onmouseup = end
    }

    //* Draw grid effect
    grid() {
        const ctxGrid = this.canvasGrid.getContext("2d")

        for (let r = 0; r < this.screen.width; r++) {
            for (let c = 0; c < this.screen.height; c++) {
                ctxGrid.fillStyle = (r % 2 == 0 ? (c % 2 == 0 ? "#f3f3f3" : "#d0d0d0") : (c % 2 == 0 ? "#d0d0d0" : "#f3f3f3"))
                ctxGrid.fillRect(r, c, this.pixel, this.pixel)
            }
        }
    }

    getKeyBoard() {
        window.onkeydown = (e) => {
            switch (e.key) {
                case "p":
                    this.setSelectTool(this.tools[0])
                    break
                case "e":
                    this.setSelectTool(this.tools[1])
                    break
                default:
                    break
            }
        }
    }
}

const spriteEditor = new SpriteEditor(canvas, canvasGrid, containerTools)