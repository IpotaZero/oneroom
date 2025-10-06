import { Scene } from "../Game/Scene"
import { Command } from "../utils/Command"
import { keyboard } from "../utils/Input"
import { Itext } from "../utils/Itext"

export class GameEvent {
    #g: Generator<void, GameEvent | void, void>

    #box: HTMLDivElement
    #text: HTMLDivElement
    #icon: HTMLImageElement

    constructor(scene: Scene) {
        this.#box = document.createElement("div")
        this.#text = document.createElement("div")
        this.#icon = document.createElement("img")

        this.#g = this.G(scene)

        this.#setupElements()
        scene.container.appendChild(this.#box)
    }

    #setupElements() {
        this.#box.className = "hidden"
        this.#box.id = "serif-box"

        this.#icon.id = "serif-icon"
        this.#icon.style.display = "none"
        this.#box.appendChild(this.#icon)

        this.#text.id = "text-box"
        this.#box.appendChild(this.#text)
    }

    #destroy() {
        if (this.#box.classList.contains("hidden")) {
            this.#box.remove()
            return
        }

        this.#box.addEventListener("transitionend", () => {
            this.#box.remove()
        })

        this.#box.classList.add("hidden")
    }

    protected *G(scene: Scene): Generator<void, GameEvent | void, void> {}

    update() {
        const result = this.#g.next()
        if (result.done) {
            this.#destroy()
        }
        return result
    }

    protected *say(texts: (string | SayCommand)[]) {
        this.#box.classList.remove("hidden")

        const copy = [...texts]

        while (copy.length > 0) {
            const command = copy.shift()!

            if (typeof command === "string") {
                yield* this.#handleTextCommand(command)
                continue
            }

            if (command.type === "character") {
                this.#handleCharacterCommand(command.url)
                continue
            } else if (command.type === "ask") {
            }
        }

        this.#box.classList.add("hidden")
    }

    protected *ask(options: readonly string[], option: { title?: string } = {}): Generator<any, number | null, any> {
        this.#box.classList.remove("hidden")

        this.#text.innerHTML = ""

        const command = new Command(`
            <div class="buttons" id="first">
                ${option.title ? `<div class="title">${option.title}</div>` : ""}
                ${options.map((option, i) => `<button data-link="${i}">${option}</button>`).join("")}
            </div>
            <style>
                #serif-box #first {
                    display: flex;
                    flex-direction: column;
                    padding-left:1em;
                    align-items: flex-start;
                }
            </style>
        `)

        this.#text.appendChild(command.container)

        let selected: number | null = -1

        command.on(".*", (command) => {
            selected = command.index
        })

        command.onBack(() => {
            selected = null
        })

        while (selected === -1) {
            command.update()
            yield
        }

        this.#box.classList.add("hidden")

        return selected
    }

    protected *wait() {
        while (!keyboard.longPressed.has("KeyZ") && !keyboard.longPressed.has("KeyX")) yield
    }

    #handleCharacterCommand(url: string) {
        if (url === "none") {
            this.#icon.style.display = "none"
        } else {
            this.#icon.style.display = ""
            this.#icon.src = `assets/images/icon/${url}`
        }
    }

    *#handleTextCommand(command: string) {
        const itext = new Itext(command)

        this.#text.innerHTML = ""
        this.#text.appendChild(itext)

        yield* this.wait()
        yield

        if (!itext.isFinished) {
            itext.finish()
            yield* this.wait()
        }

        yield
    }
}

type SayCommand = {
    type: "character"
    url: string
}
