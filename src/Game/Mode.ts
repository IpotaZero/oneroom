import { EventSerif } from "../Events/EventSerif"
import { GameEvent } from "../Events/GameEvent"
import { keyboard } from "../utils/Input"
import { Scene } from "./Scene"

export class Mode {
    sceneRef

    get scene() {
        return this.sceneRef.deref()!
    }

    constructor(scene: Scene) {
        this.sceneRef = new WeakRef(scene)
    }

    end(): void {}

    update(): void {}
}

export class ModePlay extends Mode {
    update(): void {
        this.scene.map.realSprites.forEach((s) => s.update(this.scene))

        if (keyboard.pushed.has("KeyZ")) {
            const events = this.scene.map.realSprites
                .filter((s) => s.getExistsP().some((p) => p.equals(this.scene.map.player.getDirectedP())))
                .map((s) => s.action(this.scene.map, this))
                .filter((s) => s instanceof GameEvent)

            if (events.length > 0) {
                this.scene.goto(new ModeEvent(this.scene, events))
            }
        }

        if (keyboard.pushed.has("KeyX")) {
            this.scene.goto(new ModeMenu(this.scene))
        }
    }
}

export class ModeEvent extends Mode {
    #currentEvent: GameEvent
    #eventQueue: GameEvent[] = []

    constructor(scene: Scene, events: GameEvent[]) {
        super(scene)

        const copy = [...events]

        this.#currentEvent = copy.shift()!
        this.#eventQueue = copy
    }

    update() {
        const done = this.#currentEvent.update()

        if (done) {
            if (this.#eventQueue.length === 0) {
                this.scene.goto(new ModePlay(this.scene))
            } else {
                this.#currentEvent = this.#eventQueue.shift()!
            }
        }
    }
}

export class ModeMenu extends Mode {
    #container = document.createElement("div")
    #index = 0

    #history: string[] = []

    #buttonFamily: Record<string, HTMLButtonElement[]> = {}

    constructor(scene: Scene) {
        super(scene)

        this.#container.id = "menu"
        this.#container.className = "hidden"

        this.#container.innerHTML = `
            <div id="left">
                <div class="buttons" id="first">
                    <button data-link="resume">再開</button>
                    <button data-link="items">持物</button>
                    <button data-link="end">終了</button>
                </div>

                <div id="money">0円</div>
            </div>
            <div id="right">
                <div id="characters">
                    <div class="character">
                        <img class="status-icon" src="assets/images/icon/ユウナ.png" alt="" />
                        <div class="status">
                            ユウナ <br />
                            LV: 9 <br />
                            HP: 9 MP: 0 SAN: 20<br />
                        </div>
                    </div>
                </div>
                <div class="buttons hidden" id="items">
                    <span class="title">持物</span>
                    <button data-link="key-red">赤い鍵</button>
                    <button>青い鍵</button>
                    <button>緑の鍵</button>
                    <button>黄色の鍵</button>
                    <button>紫の鍵</button>
                </div>
            </div>
        `

        document.querySelector("#container")!.appendChild(this.#container)

        this.#container.querySelectorAll(".buttons").forEach((buttons) => {
            this.#buttonFamily[buttons.id] = Array.from(buttons.querySelectorAll("button"))
        })

        this.#goto("first")

        requestAnimationFrame(() => {
            this.#container.classList.remove("hidden")
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

    end() {
        this.#container.ontransitionend = () => this.#container.remove()
        document.querySelector("#menu")?.classList.add("hidden")
    }

    #getCurrentButtons() {
        return this.#buttonFamily[this.#history.at(-1)!]
    }

    #move() {
        const currentButtons = this.#getCurrentButtons()

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
        if (this.#history.at(-1)! === "first") {
            this.scene.goto(new ModePlay(this.scene))
            return
        } else if (this.#history.at(-1)! === "items") {
            this.#container.querySelector("#characters")!.classList.remove("hidden")
            this.#container.querySelector("#items")!.classList.add("hidden")
        }

        this.#history.pop()

        const index = Math.max(
            this.#getCurrentButtons().findIndex((b) => b.classList.contains("selected")),
            0,
        )

        this.#goto(this.#history.pop()!)

        this.#index = index
    }

    #select() {
        const link = this.#getCurrentButtons()[this.#index].dataset["link"]

        if (link === "resume") {
            this.scene.goto(new ModePlay(this.scene))
        } else if (link === "items") {
            this.#container.querySelector("#characters")!.classList.add("hidden")
            this.#container.querySelector("#items")!.classList.remove("hidden")
        } else if (link === "key-red") {
            this.scene.goto(new ModeEvent(this.scene, [new EventSerif(this.scene, ["テスト"])]))
        }

        if (link) {
            this.#goto("items")
        }
    }

    #goto(id: string) {
        const buttons = this.#container.querySelector(`#${id}`)

        if (buttons) {
            this.#index = 0
            this.#history.push(id)
            this.#updateClass()
        }
    }

    #updateClass() {
        const currentButtons = this.#getCurrentButtons()
        currentButtons.forEach((b) => b.classList.remove("selected"))
        currentButtons[this.#index].classList.add("selected")
    }
}
