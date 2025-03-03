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
                mode: "pencil",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123462.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    this.ctx.fillStyle = this.tool.fill
                    this.ctx.fillRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                }
            },
            {
                mode: "eraser",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123513.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    this.ctx.clearRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                }
            },
            {
                mode: "paint roller",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123528.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    /* 
                    !   Passos
                    !   1.  pegar as coordenadas do click
                    !   2.  pegar o data da img (const data = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data)
                    !   3.  varrer para cima (até o primeiro pixel colorido)
                    !   4.  varrer para baixo (até o último pixel colorido)
                    !   5.  pegar dados e demarcar "contorno" para o path
                    !   6.  função handler para fazer o (ctx.beginPath(); ctx.moveTo(<...>); ctx.lineTo(<...>); ctx.fill();)
                    
                    ctx.beginPath();
                    ctx.moveTo(75, 50);
                    ctx.lineTo(100, 75);
                    ctx.lineTo(100, 25);
                    ctx.fill(); */

                    const data = this.getImageData()
                    console.log(data)
                }
            },
            {
                mode: "move",
                icon: "https://cdn-icons-png.freepik.com/512/2123/2123500.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    const position = {
                        x: this.tool.position.x - this.mouseDown.initPosition.x,
                        y: this.tool.position.y - this.mouseDown.initPosition.y
                    }
                    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                    this.recover(position)
                }
            },
            {
                mode: "dropper",
                icon: "https://cdn-icons-png.freepik.com/512/1412/1412328.png?ga=GA1.1.553086067.1740610280",
                position: { x: 0, y: 0 },
                action: () => {
                    const data = this.getImageData()
                    const { r, g, b, a } = data[this.tool.position.y][this.tool.position.x]
                    if (a != 0) {
                        this.tool.fill = `rgba(${r},${g},${b},${a})`
                        document.querySelector("label .color").style.backgroundColor = `rgba(${r},${g},${b},${a})`
                    }

                }
            }
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
                    const form = document.createElement("form")
                    form.setAttribute("class", "uploadImage")
                    form.innerHTML += "<h2>Importar imagem</h2>"
                    const img = document.createElement("img")
                    img.setAttribute("alt", "image example")
                    img.style.visibility = "hidden"
                    const label = document.createElement("label")
                    label.setAttribute("for", "file")
                    label.setAttribute("class", "pressable choose")
                    label.innerText = "Selecionar"
                    const input = document.createElement("input")
                    input.setAttribute("id", "file")
                    input.setAttribute("name", "file")
                    input.setAttribute("type", "file")
                    input.setAttribute("accept", ".png")
                    input.setAttribute("required", "true")
                    const button = document.createElement("button")
                    button.innerText = "Importar"
                    input.onchange = (e) => {
                        img.style.visibility = "visible"
                        const file = e.target.files[0]
                        img.src = URL.createObjectURL(file);
                        console.log(file)
                    }
                    form.onsubmit = (e) => {
                        e.preventDefault()
                        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
                        this.ctx.drawImage(img, 0, 0)
                        containerPopup.querySelector(".close").click()
                    }

                    form.appendChild(img)
                    form.appendChild(label)
                    form.appendChild(input)
                    form.appendChild(button)
                    containerPopup.appendChild(form)
                    containerPopup.classList.add("open")
                }
            },
            {
                mode: "save",
                icon: "https://cdn-icons-png.freepik.com/512/7039/7039737.png?ga=GA1.1.553086067.1740610280",
                action: () => {
                    this.save()
                    const containerPopup = document.querySelector(".containerPopup")
                    const form = document.createElement("form")
                    form.setAttribute("class", "saveImage")
                    form.innerHTML += "<h2>Salvar imagem</h2>"
                    const img = document.createElement("img")
                    img.setAttribute("alt", "image example")
                    img.setAttribute("src", this.drawRecover[this.drawRecover.length - 1]).src
                    const input = document.createElement("input")
                    input.setAttribute("type", "text")
                    input.setAttribute("placeholder", "Nome do arquivo")
                    input.setAttribute("required", "true")
                    const button = document.createElement("button")
                    button.innerText = "Salvar"
                    form.onsubmit = (e) => {
                        e.preventDefault()
                        const img = this.drawRecover[this.drawRecover.length - 1]
                        const handlerLink = document.createElement("a")
                        handlerLink.href = img.src
                        this.file.name = input.value
                        handlerLink.download = this.file.name
                        handlerLink.click()
                    }

                    form.appendChild(img)
                    form.appendChild(input)
                    form.appendChild(button)
                    containerPopup.appendChild(form)
                    containerPopup.classList.add("open")
                }
            },
            {
                mode: "set",
                icon: "https://cdn-icons-png.freepik.com/512/7039/7039819.png?ga=GA1.1.553086067.1740610280",
                action: () => {
                    const containerPopup = document.querySelector(".containerPopup")
                    containerPopup.classList.add("open")
                }
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

    //* Get and return data image
    getImageData() {
        const tmpData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height).data
        const data = []
        for (let r = 0; r < this.screen.height; r++) {
            const tmpDataRowSlice = tmpData.slice(this.screen.width * 4 * r, this.screen.width * 4 * (r + 1))
            const tmpDataRow = []
            for (let c = 0; c < tmpDataRowSlice.length; c += 4) {
                tmpDataRow.push(
                    {
                        r: tmpDataRowSlice[c],
                        g: tmpDataRowSlice[c + 1],
                        b: tmpDataRowSlice[c + 2],
                        a: tmpDataRowSlice[c + 3],
                    }
                )
            }
            data.push(tmpDataRow)
        }

        return data
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
            div.setAttribute("class", "tool")
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
        this.tool = {
            mode: tool.mode,
            icon: tool.icon,
            fill: this.tool.fill,
            position: tool.position,
            action: tool.action
        }
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
        this.drawRecover.push(img)
    }

    //* Recover image had saved before action (resize and another actions)
    recover(position = { x: 0, y: 0 }) {
        const imgRecover = this.drawRecover[this.drawRecover.length - 1]
        this.ctx.drawImage(imgRecover, position.x, position.y)
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

    //* Handler to get click/touch user and it do some action
    getClick() {
        const move = (e) => {
            this.getPositionMouse(e)
            this.mouseDown?.progress ? this.tool.action() : {}
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
                    // pencil
                    this.setSelectTool(this.tools[0])
                    break
                case "e":
                    // eraser
                    this.setSelectTool(this.tools[1])
                    break
                case "r":
                    // paint roller
                    this.setSelectTool(this.tools[2])
                    break
                case "m":
                    // move
                    this.setSelectTool(this.tools[3])
                    break
                case "d":
                    // dropper
                    this.setSelectTool(this.tools[4])
                    break
                default:
                    break
            }
        }
    }
}

const spriteEditor = new SpriteEditor(canvas, canvasGrid, containerTools)