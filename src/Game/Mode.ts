import { GameEvent } from "../Events/GameEvent"
import { Command } from "../utils/Command"
import { Input, keyboard } from "../utils/Input"
import { Character } from "./Character"
import { Scene } from "./Scene"

export class Mode {
    sceneRef: WeakRef<Scene>

    get scene(): Scene {
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

        if (keyboard.pushed.includes("KeyZ")) {
            const events = this.scene.map.realSprites
                .filter((s) => s.collision)
                .filter((s) => s.getExistsP().some((p) => p.equals(this.scene.map.player.getDirectedP())))
                .map((s) => s.action(this.scene))
                .filter((s) => s instanceof Array)
                .flat()

            if (events.length > 0) {
                this.scene.goto(new ModeEvent(this.scene, events))
            }
        }

        if (keyboard.pushed.includes("KeyX")) {
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
        const result = this.#currentEvent.update()

        if (result.done) {
            if (result.value instanceof Array) {
                this.#eventQueue.push(...result.value)
            }

            if (this.#eventQueue.length === 0) {
                this.scene.goto(new ModePlay(this.scene))
            } else {
                this.#currentEvent = this.#eventQueue.shift()!
            }
        } else if (result.value instanceof GameEvent) {
            this.#eventQueue.unshift(this.#currentEvent)
            this.#currentEvent = result.value
        }
    }
}

export class ModeMenu extends Mode {
    readonly #command: Command

    #time

    constructor(scene: Scene) {
        super(scene)

        this.#command = new Command(`
            <div id="left">
                <div class="buttons" id="first">
                    <button data-link="resume">再開</button>
                    <button data-link="items">持物</button>
                    <button data-link="yesno">終了</button>
                </div>

                <div id="yesno" class="buttons hidden">
                    ほんとに?
                    <button data-link="end-yes">はい</button>
                    <button data-link="end-no">いいえ</button>
                </div>

                <div id="under">
                    <div id="time"></div>
                    <div id="money">0円</div>
                </div>
            </div>

            <div id="right">
                <div id="characters">
                    ${scene.characters.map((c) => this.#createCharacterStatus(c)).join("")}
                </div>
                <div class="buttons hidden" id="items">
                    <span class="title">持物</span>
                    ${scene.items.items
                        .map((item) => `<button data-link="item-${item.id}">${item.id}</button>`)
                        .join("")}
                </div>
            </div>
        `)

        this.#time = this.#command.container.querySelector("#time")!

        this.#command.on("resume", () => {
            this.scene.goto(new ModePlay(this.scene))
        })

        this.#command.on("items", () => {
            this.#command.container.querySelector("#characters")!.classList.add("hidden")
            this.#command.container.querySelector("#items")!.classList.remove("hidden")
        })

        this.#command.on("item-.*", (command) => {
            this.scene.goto(new ModeEvent(this.scene, [scene.items.items[command.index].event()]))
        })

        this.#command.on("yesno", () => {
            this.#command.container.querySelector("#yesno")!.classList.remove("hidden")
        })

        this.#command.on("end-yes", () => {
            window.close()
        })

        this.#command.on("end-no", () => {
            this.#command.back(1)
        })

        this.#command.onLeft("yesno", () => {
            this.#command.container.querySelector("#first")!.classList.remove("hidden")
            this.#command.container.querySelector("#yesno")!.classList.add("hidden")
        })

        this.#command.onLeft("items", () => {
            this.#command.container.querySelector("#characters")!.classList.remove("hidden")
            this.#command.container.querySelector("#items")!.classList.add("hidden")
        })

        this.#command.onBack(() => {
            this.scene.goto(new ModePlay(this.scene))
        })

        this.#command.container.id = "menu"
        scene.container.appendChild(this.#command.container)
    }

    update() {
        const elapsed = performance.now() - this.scene.playStart
        const totalSeconds = Math.floor(elapsed / 1000)
        const hours = Math.floor(totalSeconds / 3600)
        const minutes = Math.floor((totalSeconds % 3600) / 60)
        const seconds = totalSeconds % 60
        this.#time.textContent = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`
        this.#command.update()
    }

    end() {
        this.#command.container.ontransitionend = () => this.#command.container.remove()
        document.querySelector("#menu")?.classList.add("hidden")
    }

    #createCharacterStatus(c: Character) {
        return `
            <div class="character">
                <img class="status-icon" src="assets/images/icon/${c.icon}" alt="" />
                <div class="status">
                    ${c.name} <br />
                    LV: ${c.status.lv} <br />
                    HP: ${c.status.hp} MP: ${c.status.mp} SAN: ${c.status.san}<br />
                </div>
            </div>
        `
    }
}
