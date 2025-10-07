import { WIDTH, HEIGHT, TILE_SIZE } from "./Constant"
import { Input } from "../utils/Input"

import { Camera } from "./Camera"
import { MapData } from "./MapData"
import { Character } from "./Character"
import { Mode, ModeEvent, ModePlay } from "./Mode"
import { Item, Items } from "./Item"

import mapdata from "../../assets/mapdata/mapdata.json"
import { Flags } from "./Flags"
import Player from "../Sprites/Player"

export class Scene {
    readonly ready: Promise<void>
    readonly playStart = performance.now()

    readonly camera: Camera
    readonly map: MapData

    readonly container = document.querySelector("#container") as HTMLDivElement

    readonly flags: Flags = new Flags()
    readonly items: Items = new Items()

    characters: Character[] = [new Character("ユウナ", "ユウナ.png")]

    #mode: Mode

    readonly cvs
    readonly #ctx: CanvasRenderingContext2D

    constructor() {
        const { cvs, ctx } = this.#createCtx()
        this.cvs = cvs
        this.#ctx = ctx

        this.camera = new Camera()

        this.map = new MapData(mapdata as any, new Player(this), this)
        // this.map = new MapData(mapdata, new MapWriter(this), this)

        // this.#mode = new ModeEvent(this, [new EventHowToPlay(this), new EventFirst(this)])
        this.#mode = new ModePlay(this)

        this.ready = this.map.ready
    }

    update() {
        this.#mode.update()
        this.#draw()
        Input.update()
    }

    goto(mode: Mode) {
        this.#mode.end()
        this.#mode = mode
    }

    #createCtx() {
        const cvs = document.createElement("canvas")
        cvs.width = WIDTH
        cvs.height = HEIGHT
        cvs.id = "sprites"

        const ctx = cvs.getContext("2d", { alpha: false })!
        ctx.imageSmoothingEnabled = false

        this.container.appendChild(cvs)

        return { cvs, ctx }
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
        this.map.realSprites.filter((s) => s.visible).forEach((s) => s.draw(this.#ctx))
        this.#ctx.restore()
    }
}
