
window.oncontextmenu = (e) => {
    e.preventDefault()
}

const positionMouse = document.querySelector(".positionMouse")
const inputScale = document.querySelector(".scale")
const canvas = document.querySelector("canvas")

inputScale.onchange = (e) => {
    canvasInstance.scale = e.target.value
    canvasInstance.resize()
    canvasInstance.recover()
}

class Canvas {
    constructor(CanvasElement = HTMLCanvasElement) {
        this.canvas = CanvasElement
        this.ctx = this.canvas.getContext("2d")
        this.scale = 10
        this.screen = {
            width: 16,
            height: 16
        }
        this.pixel = 1
        this.tool = {
            mode: "paint",
            fill: "#000",
            position: { x: 0, y: 0 }
        }
        this.drawRecover = []
        this.tools = [
            {},
            {},
            {},
        ]
        this.resize()
        this.getClick()
    }

    save() {
        const img = new Image()
        img.src = this.canvas.toDataURL()
        this.drawRecover.push(img)
    }

    recover() {
        const imgRecover = this.drawRecover[this.drawRecover.length - 1]
        this.ctx.drawImage(imgRecover, 0, 0)
    }

    resize() {
        this.canvas.width = this.screen.width
        this.canvas.height = this.screen.height
        this.canvas.style.width = `${this.screen.width * this.scale}px`
        this.canvas.style.height = `${this.screen.height * this.scale}px`
        inputScale.value = this.scale
    }

    draw() {
        if (this.mouseDown) {
            switch (this.tool.mode) {
                case "paint":
                    this.ctx.fillStyle = this.tool.fill
                    this.ctx.fillRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                    break
                case "erase":
                    this.ctx.fillStyle = this.tool.fill
                    this.ctx.fillRect(this.tool.position.x, this.tool.position.y, this.pixel, this.pixel)
                    break
                default:
                    break
            }
        }
    }

    getPositionMouse(e) {
        this.tool.position = {
            x: Math.floor((e.x - this.canvas.offsetLeft) / this.scale),
            y: Math.floor((e.y - this.canvas.offsetTop) / this.scale)
        }

        positionMouse.innerHTML = `x: ${this.tool.position.x}, y: ${this.tool.position.y}`
    }

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

    getKeyBoard() {

    }
}

const canvasInstance = new Canvas(canvas)