import { keyboard } from "./Input"

export class Command {
    container = document.createElement("div")

    #index = 0
    #currentBranch = "unused-id"
    #history: string[] = []

    #buttonFamily: Record<string, HTMLButtonElement[]> = {}

    #onHandler: Record<string, () => void> = {}
    #onLeftHandler: Record<string, () => void> = {}
    #onBackHandler = () => {}

    constructor(html: string) {
        this.container.id = "menu"
        this.container.className = "hidden"
        this.container.innerHTML = html

        this.container.querySelectorAll(".buttons").forEach((buttons) => {
            this.#buttonFamily[buttons.id] = Array.from(buttons.querySelectorAll("button"))
        })

        this.#goto("first")

        requestAnimationFrame(() => {
            this.container.classList.remove("hidden")
        })
    }

    update() {
        this.#move()

        if (keyboard.pushed.has("KeyX")) {
            this.#back()
            return
        }

        if (keyboard.pushed.has("KeyZ")) {
            this.#select()
            return
        }
    }

    on(id: string, handler: () => void) {
        this.#onHandler[id] = handler
    }

    onLeft(id: string, handler: () => void) {
        this.#onLeftHandler[id] = handler
    }

    onBack(handler: () => void) {
        this.#onBackHandler = handler
    }

    #getCurrentButtons(): HTMLButtonElement[] | undefined {
        return this.#buttonFamily[this.#history.at(-1)!]
    }

    #move() {
        const currentButtons = this.#getCurrentButtons()

        if (!currentButtons) return

        if (keyboard.longPressed.has("ArrowUp")) {
            this.#index = (this.#index + currentButtons.length - 1) % currentButtons.length
            this.#updateClass()
        }

        if (keyboard.longPressed.has("ArrowDown")) {
            this.#index = (this.#index + 1) % currentButtons.length
            this.#updateClass()
        }
    }

    #back() {
        if (this.#history.length === 1) {
            this.#onBackHandler()
            return
        }

        if (this.#history.length === 0) return

        this.#history.pop()

        const index = Math.max(
            this.#getCurrentButtons()!.findIndex((b) => b.classList.contains("selected")),
            0,
        )

        this.#goto(this.#history.pop()!)

        this.#index = index
        this.#updateClass()
    }

    #select() {
        const link = this.#getCurrentButtons()![this.#index].dataset["link"]

        if (link) {
            this.#goto(link)
        }
    }

    #goto(id: string) {
        const buttons = this.#buttonFamily[id]

        this.#onLeftHandler[this.#currentBranch]?.()

        this.#currentBranch = id

        this.#onHandler[this.#currentBranch]?.()

        if (buttons) {
            this.#index = 0
            this.#history.push(id)
            this.#updateClass()
        }
    }

    #updateClass() {
        const currentButtons = this.#getCurrentButtons()!
        currentButtons.forEach((b) => b.classList.remove("selected"))
        currentButtons[this.#index].classList.add("selected")
    }
}
