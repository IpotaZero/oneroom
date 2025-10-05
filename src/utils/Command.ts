import { keyboard } from "./Input"

type Handler = () => void

export class Command {
    container = document.createElement("div")

    #index = 0
    #currentBranch = "unused-id"
    #history: string[] = []

    #buttonFamily: Record<string, HTMLButtonElement[]> = {}
    #onHandler: Record<string, Handler> = {}
    #onLeftHandler: Record<string, Handler> = {}
    #onBackHandler: Handler = () => {}

    constructor(html: string) {
        this.container.id = "menu"
        this.container.className = "hidden"
        this.container.innerHTML = html

        this.#initButtonFamily()
        this.#goto("first")

        requestAnimationFrame(() => {
            this.container.classList.remove("hidden")
        })
    }

    update() {
        this.#move()

        if (keyboard.pushed.has("KeyX")) {
            this.#back()
        } else if (keyboard.pushed.has("KeyZ")) {
            this.#select()
        }
    }

    on(id: string, handler: Handler) {
        this.#onHandler[id] = handler
    }

    onLeft(id: string, handler: Handler) {
        this.#onLeftHandler[id] = handler
    }

    onBack(handler: Handler) {
        this.#onBackHandler = handler
    }

    // --- Private Methods ---

    #initButtonFamily() {
        this.container.querySelectorAll(".buttons").forEach((buttons) => {
            this.#buttonFamily[buttons.id] = Array.from(buttons.querySelectorAll("button"))
        })
    }

    #getCurrentButtons(): HTMLButtonElement[] | undefined {
        return this.#buttonFamily[this.#currentBranch]
    }

    #move() {
        const currentButtons = this.#getCurrentButtons()
        if (!currentButtons) return

        if (keyboard.longPressed.has("ArrowUp")) {
            this.#index = (this.#index + currentButtons.length - 1) % currentButtons.length
            this.#updateClass()
        } else if (keyboard.longPressed.has("ArrowDown")) {
            this.#index = (this.#index + 1) % currentButtons.length
            this.#updateClass()
        }
    }

    #back() {
        if (this.#history.length === 1) {
            this.#onBackHandler()
            return
        }

        if (this.#history.length === 0) throw new Error("空")

        this.#history.pop()
        const prevId = this.#history.pop()!

        const buttons = this.#buttonFamily[prevId]!
        const index = Math.max(
            buttons.findIndex((b) => b.classList.contains("selected")),
            0,
        )

        this.#goto(prevId)

        this.#index = index
        this.#updateClass()
    }

    #select() {
        const currentButtons = this.#getCurrentButtons()
        if (!currentButtons) return

        const link = currentButtons[this.#index]?.dataset["link"]
        if (link) {
            this.#goto(link)
        }
    }

    #goto(id: string) {
        this.#onLeftHandler[this.#currentBranch]?.()
        this.#currentBranch = id
        this.#onHandler[this.#currentBranch]?.()

        if (this.#buttonFamily[id]) {
            this.#index = 0
            this.#history.push(id)
            this.#updateClass()
        }
    }

    #updateClass() {
        const currentButtons = this.#getCurrentButtons()
        if (!currentButtons) return

        currentButtons.forEach((b, i) => {
            b.classList.toggle("selected", i === this.#index)
        })
    }
}
