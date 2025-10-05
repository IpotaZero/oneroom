import tileURL from "../../assets/tiles.json"
import { MapWriter } from "../Sprites/MapWriter"
import { Player } from "../Sprites/Player"
import { Sprites } from "../Sprites/Speites"
import { Sprite } from "../Sprites/Sprite"
import { TILE_SIZE } from "./Constant"
import { Scene } from "./Scene"

const tileMaps = new Map<string, HTMLImageElement>()

export class MapData {
    readonly WIDTH: number
    readonly HEIGHT: number

    sprites: SpriteJSON[]
    tiles: number[][]
    walls: number[][]

    realSprites: Sprite[] = []
    canvas!: HTMLCanvasElement

    readonly player: Player | MapWriter

    readonly ready: Promise<void>

    constructor(mapdata: MapDataJSON, player: Player | MapWriter, scene: Scene) {
        this.WIDTH = mapdata.walls[0].length
        this.HEIGHT = mapdata.walls.length

        this.sprites = mapdata.sprites
        this.tiles = mapdata.tiles
        this.walls = mapdata.walls

        this.player = player

        this.ready = this.setup(scene)
    }

    async setup(scene: Scene) {
        this.realSprites = this.sprites.map((data) => new Sprites[data.class](scene, data.options))
        this.realSprites.push(this.player)
        this.canvas = await this.#createCanvas()
    }

    getRealWall() {
        const realWall = structuredClone(this.walls)

        this.realSprites.forEach((s) => {
            for (let i = 0; i < s.size.y; i++) {
                for (let j = 0; j < s.size.x; j++) {
                    realWall[s.p.y + i][s.p.x + j] = 1
                }
            }
        })

        return realWall
    }

    json(): MapDataJSON {
        return {
            sprites: this.sprites,
            walls: this.walls,
            tiles: this.tiles,
        }
    }

    async #createCanvas() {
        const c = document.createElement("canvas")
        c.width = this.WIDTH * TILE_SIZE
        c.height = this.HEIGHT * TILE_SIZE

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

        this.walls.forEach((row, i) =>
            row.forEach((wall, j) => {
                if (wall === 1) {
                    ctx.strokeStyle = "red"
                    ctx.strokeRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                }
            }),
        )

        return c
    }
}

type SpriteJSON = {
    class: string
    options?: any
}

type MapDataJSON = {
    "sprites": SpriteJSON[]
    "walls": number[][]
    "tiles": number[][]
}
