import { Scene } from "../Game/Scene"
import { keyboard } from "../utils/Input"
import { Itext } from "../utils/Itext"

export class GameEvent {
    g: Generator
    isFinished = false

    box = document.createElement("div")
    text = document.createElement("div")
    icon = document.createElement("img")

    constructor(scene: Scene) {
        this.g = this.G(scene)

        this.box.className = "hidden"
        this.box.id = "serif-box"

        this.icon.id = "serif-icon"
        this.icon.style.display = "none"
        this.box.appendChild(this.icon)

        this.text.id = "text-box"
        this.box.appendChild(this.text)

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

    *G(scene: Scene): Generator<any, any, any> {}

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
            const command = copy.shift()!

            if (command === "character") {
                const url = copy.shift()!

                if (url === "none") {
                    this.icon.style.display = "none"
                } else {
                    this.icon.style.display = ""
                    this.icon.src = `assets/images/icon/${url}`
                }

                continue
            }

            const itext = new Itext(command)

            this.text.innerHTML = ""
            this.text.appendChild(itext)

            while (!keyboard.longPressed.has("KeyZ")) yield
            yield

            if (!itext.isFinished) {
                itext.finish()
                while (!keyboard.longPressed.has("KeyZ")) yield
            }

            yield
        }

        this.box.classList.add("hidden")
    }
}
