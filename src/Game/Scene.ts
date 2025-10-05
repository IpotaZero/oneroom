import { Camera } from "./Camera"
import { WIDTH, HEIGHT, TILE_SIZE } from "./Constant"
import { MapData } from "./MapData"
import { Player } from "../Sprites/Player"
import { Input, keyboard } from "../utils/Input"
import { MapWriter } from "../Sprites/MapWriter"
import { vec } from "../utils/Vec"
import { GameEvent } from "../Events/GameEvent"
import { EventFirst } from "../Events/EventFirst"

import mapdata from "../../assets/mapdata/mapdata.json"

export class Scene {
    readonly ready

    readonly camera
    readonly map

    readonly flags: string[] = []
    readonly items: string[] = []

    readonly #ctx

    #mode: Mode

    constructor() {
        const cvs = document.createElement("canvas")
        cvs.width = WIDTH
        cvs.height = HEIGHT

        this.#ctx = cvs.getContext("2d")!
        this.#ctx.imageSmoothingEnabled = false

        document.body.querySelector("#container")!.appendChild(cvs)

        this.camera = new Camera()

        this.map = new MapData(mapdata, new Player(this), this)
        // this.map = new MapData(mapdata, new MapWriter(this), this)

        this.#mode = new ModeEvent(this, [new EventFirst(this)])

        this.ready = this.map.ready
    }

    update() {
        const next = this.#mode.update()

        if (next) {
            this.#mode = next
        }

        this.#draw()
        Input.update()
    }

    #draw() {
        this.#ctx.clearRect(0, 0, WIDTH, HEIGHT)

        this.camera.p = this.camera.p.add(this.map.player.p.sub(this.camera.p).scale(1 / 2))
        this.camera.p.x = Math.min(Math.max(WIDTH / 2, this.camera.p.x), this.map.WIDTH * TILE_SIZE - WIDTH / 2)
        this.camera.p.y = Math.min(Math.max(HEIGHT / 2, this.camera.p.x), this.map.HEIGHT * TILE_SIZE - HEIGHT / 2)

        this.#ctx.save()
        this.#ctx.scale(this.camera.scale, this.camera.scale)
        this.#ctx.translate(WIDTH / 2 - this.camera.p.x, HEIGHT / 2 - this.camera.p.y)
        this.#ctx.drawImage(this.map.canvas, 0, 0)
        this.map.realSprites.forEach((s) => s.draw(this.#ctx))
        this.#ctx.restore()
    }
}

class Mode {
    sceneRef

    get scene() {
        return this.sceneRef.deref()!
    }

    constructor(scene: Scene) {
        this.sceneRef = new WeakRef(scene)
    }

    update(): Mode | void {}
}

class ModePlay extends Mode {
    update(): Mode | void {
        this.scene.map.realSprites.forEach((s) => s.update(this.scene))

        if (keyboard.pushed.has("KeyZ")) {
            const events = this.scene.map.realSprites
                .filter((s) => s.getExistsP().some((p) => p.equals(this.scene.map.player.getDirectedP())))
                .map((s) => s.action(this.scene.map, this))
                .filter((s) => s instanceof GameEvent)

            if (events.length > 0) {
                return new ModeEvent(this.scene, events)
            }
        }

        if (keyboard.pushed.has("KeyX")) {
            return new ModeMenu(this.scene)
        }
    }
}

class ModeEvent extends Mode {
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
                return new ModePlay(this.scene)
            } else {
                this.#currentEvent = this.#eventQueue.shift()!
            }
        }
    }
}

class ModeMenu extends Mode {
    #container = document.createElement("div")
    #index = 0

    constructor(scene: Scene) {
        super(scene)

        this.#container.id = "menu"
        this.#container.className = "hidden"

        this.#container.innerHTML = `
            <div id="left">
                <div id="buttons">
                    <button>再開</button>
                    <button>持物</button>
                    <button>終了</button>
                </div>

                <div id="money">0円</div>
            </div>
            <div id="right">
                <div class="character">
                    <img class="status-icon" src="assets/images/icon/ユウナ.png" alt="" />
                    <div class="status">
                        ユウナ <br />
                        LV: 9 <br />
                        HP: 9 MP: 0 SAN: 20<br />
                    </div>
                </div>
            </div>
        `

        document.querySelector("#container")!.appendChild(this.#container)

        this.#getButton(0).classList.add("selected")

        requestAnimationFrame(() => {
            this.#container.classList.remove("hidden")
        })
    }

    #getButton(index: number) {
        return this.#container.querySelector(`#left #buttons button:nth-child(${index + 1})`)!
    }

    #getAllButton() {
        return this.#container.querySelectorAll(`#left #buttons button`)!
    }

    update() {
        if (keyboard.pushed.has("KeyX")) {
            this.#container.ontransitionend = () => this.#container.remove()
            this.#container.classList.add("hidden")
            return new ModePlay(this.scene)
        }

        if (keyboard.longPressed.has("ArrowUp")) {
            this.#index = (this.#index + 2) % 3
            this.#getAllButton().forEach((b) => b.classList.remove("selected"))
            this.#getButton(this.#index).classList.add("selected")
        }

        if (keyboard.longPressed.has("ArrowDown")) {
            this.#index = (this.#index + 1) % 3
            this.#getAllButton().forEach((b) => b.classList.remove("selected"))
            this.#getButton(this.#index).classList.add("selected")
        }

        if (keyboard.pushed.has("KeyZ")) {
            if (this.#index === 0) {
                this.#container.ontransitionend = () => this.#container.remove()
                document.querySelector("#menu")?.classList.add("hidden")
                return new ModePlay(this.scene)
            }
        }
    }
}
