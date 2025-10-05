import { EventSerif } from "../Events/EventSerif"
import { GameEvent } from "../Events/GameEvent"
import { Command } from "../utils/Command"
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
    readonly #command: Command

    constructor(scene: Scene) {
        super(scene)

        this.#command = new Command(`
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
        `)

        this.#command.on("resume", () => {
            this.scene.goto(new ModePlay(this.scene))
        })

        this.#command.on("items", () => {
            this.#command.container.querySelector("#characters")!.classList.add("hidden")
            this.#command.container.querySelector("#items")!.classList.remove("hidden")
        })

        this.#command.onBack(() => {
            this.scene.goto(new ModePlay(this.scene))
        })

        this.#command.onLeft("items", () => {
            this.#command.container.querySelector("#characters")!.classList.remove("hidden")
            this.#command.container.querySelector("#items")!.classList.add("hidden")
        })

        this.#command.on("key-red", () => {
            this.scene.goto(new ModeEvent(scene, [new EventSerif(scene, ["てすと"])]))
        })

        document.querySelector("#container")!.appendChild(this.#command.container)
    }

    update() {
        this.#command.update()
    }

    end() {
        this.#command.container.ontransitionend = () => this.#command.container.remove()
        document.querySelector("#menu")?.classList.add("hidden")
    }
}
