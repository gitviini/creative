// Visualização e rederização
const display = document.querySelector(".display")

class View{
    constructor(Display = Element){
        this.display = display
        this.tick = 120
    }

    render(){

    }
}

const viewInstance = new View(Display=display)