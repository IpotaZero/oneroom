import { MapData } from "../Game/MapData"
import { keyboard } from "../utils/Input"

export class GameEvent {
    g: Generator
    isFinished = false

    box = document.createElement("div")

    constructor(map: MapData) {
        this.g = this.G(map)

        this.box.className = "hidden text-end"
        this.box.id = "serif-box"
        document.body.querySelector("#container")!.appendChild(this.box)
    }

    destroy() {
        if (this.box.classList.contains("hidden")) {
            this.box.remove()
            return
        }

        this.box.addEventListener("transitionend", () => {
            this.box.remove()
        })
        this.box.classList.add("hidden")
    }

    *G(map: MapData): Generator<any, any, any> {}

    update() {
        const { done } = this.g.next()
        if (done) {
            this.destroy()
        }
        return done
    }

    *say(texts: string[]) {
        this.box.classList.remove("hidden")

        const copy = [...texts]

        while (copy.length > 0) {
            this.box.innerHTML = `<i-text>${copy.shift()!}</i-text>`
            while (!keyboard.longPressed.has("KeyZ")) yield
            yield
        }

        this.box.classList.add("hidden")
    }
}
