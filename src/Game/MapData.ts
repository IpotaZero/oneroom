import tileURL from "../../assets/tiles.json"
import { GameEvent } from "../Events/GameEvent"
import MapWriter from "../Sprites/MapWriter"
import Player from "../Sprites/Player"
import Sprite, { SpriteOption } from "../Sprites/Sprite"
import { TILE_SIZE } from "./Constant"
import { Scene } from "./Scene"

const tileMaps = new Map<string, HTMLImageElement>()

// @ts-ignore
const sprites = import.meta.glob("../Sprites/*.ts")

// @ts-ignore
const events = import.meta.glob("../Events/Events/*.ts")
await Object.values(events)[0]

export class MapData {
    readonly WIDTH: number
    readonly HEIGHT: number
    readonly id: string

    sprites: SpriteJSON[]
    tiles: number[][]
    walls: number[][]

    realSprites: Sprite[] = []
    canvas!: HTMLCanvasElement

    readonly eventMap: Map<string, typeof GameEvent> = new Map()
    readonly spriteMap: Map<string, typeof Sprite> = new Map()

    readonly player: Player | MapWriter

    readonly ready: Promise<void>

    constructor(mapdata: MapDataJSON, player: Player | MapWriter, scene: Scene) {
        this.WIDTH = mapdata.walls[0].length
        this.HEIGHT = mapdata.walls.length
        this.id = mapdata.id

        this.sprites = mapdata.sprites
        this.tiles = mapdata.tiles
        this.walls = mapdata.walls

        this.player = player

        this.ready = this.setup(scene)
    }

    async setup(scene: Scene) {
        this.realSprites = []
        this.realSprites.push(this.player)

        const processSprite = async (data: SpriteJSON) => {
            if (!this.spriteMap.has(data.class)) {
                const { default: sc } = await sprites[`../Sprites/${data.class}.ts`]()
                this.spriteMap.set(data.class, sc)
            }

            const sprite = new (this.spriteMap.get(data.class)!)(scene, data.options)
            this.realSprites.push(sprite)

            if ("event" in data.options && typeof data.options.event === "string") {
                const eventName = data.options.event

                if (!this.eventMap.has(eventName)) {
                    const path = `../Events/Events/${eventName}.ts`
                    const module = (await events[path]()) as { default: typeof GameEvent }
                    this.eventMap.set(eventName, module.default)
                }
            }
        }

        await Promise.all(this.sprites.map(processSprite))

        this.realSprites.sort((a, b) => a.zIndex - b.zIndex)

        this.canvas = await this.#createCanvas()
    }

    isWall({ x, y }: { x: number; y: number }) {
        return this.getRealWall()[y][x] === 1
    }

    getRealWall() {
        const realWall = structuredClone(this.walls)

        this.realSprites
            .filter((s) => s.collision)
            .forEach((s) => {
                for (let i = 0; i < s.size.y; i++) {
                    for (let j = 0; j < s.size.x; j++) {
                        realWall[s.p.y + i][s.p.x + j] = 1
                    }
                }
            })

        return realWall
    }

    getSpriteById(id: string) {
        const s = this.realSprites.find((s) => s.id === id)
        if (!s) throw new Error(`スプライトが見つからなかったにゃ... id="${id}"`)
        return s
    }

    json(): MapDataJSON {
        return {
            id: this.id,
            sprites: this.sprites,
            walls: this.walls,
            tiles: this.tiles,
        }
    }

    async #createCanvas() {
        const c = document.createElement("canvas")
        c.width = this.WIDTH * TILE_SIZE
        c.height = this.HEIGHT * TILE_SIZE
        c.id = "background"

        const ctx = c.getContext("2d")!

        // 画像のキャッシュ
        const loadTileImage = async (id: number) => {
            const url = tileURL[id]

            if (!tileMaps.has(url)) {
                const img = new Image()
                const loaded = new Promise<void>((resolve) => {
                    img.onload = () => resolve()
                })
                img.src = `assets/images/tiles/${url}`
                await loaded
                tileMaps.set(url, img)
            }

            return tileMaps.get(url)!
        }

        // タイルを描画
        await Promise.all(
            this.tiles.flatMap((row, i) =>
                row.map(async (id, j) => {
                    const img = await loadTileImage(id)
                    ctx.drawImage(img, TILE_SIZE * j, TILE_SIZE * i, TILE_SIZE, TILE_SIZE)
                }),
            ),
        )

        // this.walls.forEach((row, i) =>
        //     row.forEach((wall, j) => {
        //         if (wall === 1) {
        //             ctx.strokeStyle = "red"
        //             ctx.strokeRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE)
        //         }
        //     }),
        // )

        return c
    }
}

type SpriteJSON = { class: string; options: SpriteOption }

type MapDataJSON = {
    "id": string
    "sprites": SpriteJSON[]
    "walls": number[][]
    "tiles": number[][]
}
