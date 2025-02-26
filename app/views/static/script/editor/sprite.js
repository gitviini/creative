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
        this.screen = {
            width: 16,
            height: 16
        }
        this.pixel = 1
        this.drawRecover = []

        // Tool and tools list
        this.tool = {
            mode: "paint",
            fill: "#000",
            icon: "https://cdn-icons-png.freepik.com/512/3478/3478925.png?ga=GA1.1.1067191136.1740447437",
            position: { x: 0, y: 0 }
        }
        this.tools = [
            {
                mode: "paint",
                fill: "#000",
                icon: "https://cdn-icons-png.freepik.com/512/3478/3478925.png?ga=GA1.1.1067191136.1740447437",
                position: { x: 0, y: 0 }
            },
            {
                mode: "eraser",
                fill: "#fff",
                icon: "https://cdn-icons-png.freepik.com/512/3478/3478983.png?ga=GA1.1.1067191136.1740447437",
                position: { x: 0, y: 0 }
            },
            {
                mode: "move",
                fill: undefined,
                icon: "https://cdn-icons-png.freepik.com/512/3478/3478920.png?ga=GA1.1.1067191136.1740447437",
                position: { x: 0, y: 0 }
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
        pixelsize.onchange = (e) =>{
            this.pixel = e.target.value
            document.querySelector("label[for='range']").innerHTML = `${this.pixel}px`
        }
    }

    setContainerFile() {
        const containerFileOptions = containerFile.querySelector(".containerFileOptions")
        containerFile.querySelector(".select").onclick = () => containerFileOptions.classList.add("open")
        containerFileOptions.querySelector(".close").onclick = () => containerFileOptions.classList.remove("open")
    }

    //* Set init tool and selected tools
    setSelectTool(tool) {
        const selectTool = containerTools.querySelector(".select")
        selectTool.onclick = () => {
            containerTools.querySelector(".containerToolsOptions").classList.add("open")
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

    downloadImg(){

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

    //* Handler to tool 
    draw() {
        if (this.mouseDown) {
            switch (this.tool.mode) {
                case "paint":
                    this.ctx.fillStyle = this.tool.fill
                    this.ctx.fillRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                    break
                case "eraser":
                    this.ctx.clearRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                    break
                default:
                    break
            }
        }
    }

    //* Get position mouse
    getPositionMouse(e) {
        this.tool.position = {
            x: Math.floor((e.x - this.canvas.offsetLeft) / this.scale),
            y: Math.floor((e.y - this.canvas.offsetTop) / this.scale)
        }

        positionMouse.innerHTML = `x: ${this.tool.position.x}, y: ${this.tool.position.y}`
    }

    //* Handler to get click user and it do some action
    getClick() {
        this.canvas.onmousemove = (e) => {
            this.getPositionMouse(e)
            this.draw()
        }
        this.canvas.onmousedown = (e) => {
            this.getPositionMouse(e)
            this.mouseDown = true
            this.draw()
        }
        this.canvas.onmouseup = () => {
            this.save()
            this.mouseDown = false
        }
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