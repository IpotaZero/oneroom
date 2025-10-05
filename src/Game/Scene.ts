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
    #mode: "play" | "event" | "menu" = "play"

    readonly #menu = {
        index: 0,
    }

    readonly #event: { event: GameEvent } = { event: null as unknown as GameEvent }

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

        this.#event.event = new EventFirst(this)

        this.ready = this.map.ready
    }

    update() {
        if (this.#mode === "play") {
            this.#modePlay()
            this.#draw()
        } else if (this.#mode === "event") {
            this.#draw()
            this.#modeEvent()
        } else if (this.#mode === "menu") {
            this.#modeMenu()
        }

        Input.update()
    }

    #modeEvent() {
        const done = this.#event.event.update()

        if (done) {
            this.#mode = "play"
        }
    }

    #modePlay() {
        this.map.realSprites.forEach((s) => s.update(this))

        if (keyboard.pushed.has("KeyZ")) {
            this.#action()
        }

        if (keyboard.pushed.has("KeyX")) {
            this.#gotoMenu()
        }
    }

    #action() {
        this.map.realSprites
            .filter((s) => {
                for (let i = 0; i < s.size.y; i++) {
                    for (let j = 0; j < s.size.x; j++) {
                        if (s.p.add(vec(j, i)).equals(this.map.player.getDirectedP())) return true
                    }
                }
            })
            .forEach((s) => {
                const event = s.action(this.map, this)

                if (event) {
                    this.#event.event = event
                    this.#mode = "event"
                }
            })
    }

    #gotoMenu() {
        this.#mode = "menu"
        this.#menu.index = 0
        document.querySelectorAll(`#menu #left #buttons button`).forEach((b) => b.classList.remove("selected"))

        document.querySelector("#menu")?.classList.remove("hidden")
        document.querySelector(`#menu #left #buttons :nth-child(${1})`)?.classList.add("selected")
    }

    #modeMenu() {
        if (keyboard.pushed.has("KeyX")) {
            this.#mode = "play"
            document.querySelector("#menu")?.classList.add("hidden")
        }

        if (keyboard.longPressed.has("ArrowUp")) {
            this.#menu.index = (this.#menu.index + 2) % 3
            document.querySelectorAll(`#menu #left #buttons button`).forEach((b) => b.classList.remove("selected"))
            document
                .querySelector(`#menu #left #buttons :nth-child(${this.#menu.index + 1})`)
                ?.classList.add("selected")
        }

        if (keyboard.longPressed.has("ArrowDown")) {
            this.#menu.index = (this.#menu.index + 1) % 3
            document.querySelectorAll(`#menu #left #buttons button`).forEach((b) => b.classList.remove("selected"))
            document
                .querySelector(`#menu #left #buttons :nth-child(${this.#menu.index + 1})`)
                ?.classList.add("selected")
        }

        if (keyboard.pushed.has("KeyZ")) {
            if (this.#menu.index === 0) {
                this.#mode = "play"
                document.querySelector("#menu")?.classList.add("hidden")
            }
        }
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
    update() {}
}

class ModeEvent extends Mode {
    #currentEvent!: GameEvent
    #eventQueue!: GameEvent[]

    isFinished = false

    constructor(readonly events: GameEvent[]) {
        super()

        const copy = [...events]

        if (copy.length === 0) {
            this.isFinished = true
        } else {
            this.#currentEvent = copy.shift()!
            this.#eventQueue = copy
        }
    }

    override update(): void {
        const done = this.#currentEvent.update()

        if (this.#eventQueue.length === 0) {
            this.isFinished = true
        } else if (done) {
            this.#currentEvent = this.#eventQueue.shift()!
        }
    }
}
