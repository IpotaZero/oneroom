import { keyboard } from "./Input"

type Handler = (command: Command) => void

export class Command {
    container = document.createElement("div")
    index = 0
    currentBranch = "unused-id"
    history: string[] = []

    #buttonFamily: Record<string, HTMLButtonElement[]> = {}
    #onHandler: RegexDict<Handler> = new RegexDict({})
    #onLeftHandler: RegexDict<Handler> = new RegexDict({})
    #onBackHandler: Handler = () => {}

    constructor(html: string) {
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
        this.#onHandler.set(id, handler)
    }

    onLeft(id: string, handler: Handler) {
        this.#onLeftHandler.set(id, handler)
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
        return this.#buttonFamily[this.currentBranch]
    }

    #move() {
        const currentButtons = this.#getCurrentButtons()
        if (!currentButtons) return

        if (keyboard.longPressed.has("ArrowUp")) {
            this.index = (this.index + currentButtons.length - 1) % currentButtons.length
            this.#updateClass()
        } else if (keyboard.longPressed.has("ArrowDown")) {
            this.index = (this.index + 1) % currentButtons.length
            this.#updateClass()
        }
    }

    #back() {
        if (this.history.length === 1) {
            this.#onBackHandler(this)
            return
        }

        if (this.history.length === 0) throw new Error("空")

        this.history.pop()
        const prevId = this.history.pop()!

        const buttons = this.#buttonFamily[prevId]!
        const index = Math.max(
            buttons.findIndex((b) => b.classList.contains("selected")),
            0,
        )

        this.#goto(prevId)

        this.index = index
        this.#updateClass()
    }

    #select() {
        const currentButtons = this.#getCurrentButtons()
        if (!currentButtons) return

        const link = currentButtons[this.index]?.dataset["link"]
        if (link) {
            this.#goto(link)
        }
    }

    #goto(id: string) {
        this.#onLeftHandler.get(this.currentBranch)?.(this)
        this.currentBranch = id
        this.#onHandler.get(this.currentBranch)?.(this)

        if (this.#buttonFamily[id]) {
            this.index = 0
            this.history.push(id)
            this.#updateClass()
        }
    }

    #updateClass() {
        const currentButtons = this.#getCurrentButtons()
        if (!currentButtons) return

        currentButtons.forEach((b, i) => {
            b.classList.toggle("selected", i === this.index)
        })
    }
}

class RegexDict<T> {
    #dict: Record<string, T> = {}

    constructor(dict: Record<string, T>) {
        this.#dict = dict
    }

    get(key: string): T | undefined {
        for (const k in this.#dict) {
            const regex = new RegExp(`^${k}$`)
            if (regex.test(key)) {
                return this.#dict[k]
            }
        }

        return undefined
    }

    set(key: string, value: T) {
        this.#dict[key] = value
    }
}
