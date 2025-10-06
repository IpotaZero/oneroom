import { vec, Vec } from "../utils/Vec"
import { TILE_SIZE } from "../Game/Constant"
import { MapData } from "../Game/MapData"
import { GameEvent } from "../Events/GameEvent"
import { Scene } from "../Game/Scene"

type ImageOption = { url: string; p: [number, number]; size: [number, number] }

export type SpriteOption = {
    id: string
    p: [number, number]
    image: ImageOption[][]
    size: [number, number]

    creature?: boolean
}

export class Sprite {
    readonly id: string

    readonly size: Vec = vec(1, 1)
    readonly image: HTMLCanvasElement[][] = []

    p: Vec = vec(0, 0)
    q: Vec = vec(0, 0)
    direction: number = 0

    gs: Generator[] = []
    state: "walking" | "standing" = "standing"
    preState: "walking" | "standing" = "standing"
    walkFrame: number = 0

    constructor(scene: Scene, { id, p, image, size, creature }: SpriteOption) {
        this.id = id

        this.p = vec(p[0], p[1])
        this.#updateQ()
        this.size = vec(size[0], size[1])
        this.image = this.#setupImage(image)

        if (creature) {
            this.gs.push(
                function* (this: Sprite) {
                    while (true) {
                        const dir = Math.floor(Math.random() * 4)
                        const pos = [vec(1, 0), vec(0, 1), vec(-1, 0), vec(0, -1)][dir]
                        yield* this.moveBy(pos, scene.map)
                        yield* Array(25)
                    }
                }.bind(this)(),
            )
        }
    }

    getDirectedP() {
        const d = [vec(0, 1), vec(1, 0), vec(0, -1), vec(-1, 0)]
        return this.p.add(d[this.direction])
    }

    getExistsP() {
        const ps = []

        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                ps.push(this.p.add(vec(j, i)))
            }
        }

        return ps
    }

    #setupImage(images: ImageOption[][]) {
        return images.map((directionImg) =>
            directionImg.map((img) => {
                const baseImage = new Image()
                baseImage.src = `assets/images/sprites/${img.url}`

                // Create a canvas to crop the image
                const canvas = document.createElement("canvas")
                canvas.width = img.size[0]
                canvas.height = img.size[1]
                const ctx = canvas.getContext("2d")!

                // Draw after image loads
                baseImage.onload = () => {
                    ctx.drawImage(
                        baseImage,
                        img.p[0],
                        img.p[1],
                        img.size[0],
                        img.size[1], // source rect
                        0,
                        0,
                        img.size[0],
                        img.size[1], // destination rect
                    )
                }

                return canvas
            }),
        )
    }

    #updateQ() {
        this.q = this.p.scale(TILE_SIZE)
    }

    update(scene: Scene) {
        this.gs = this.gs.filter((g) => !g.next().done)

        this.preState = this.state
    }

    action(scene: Scene): GameEvent | void {}

    moveTo(v: Vec) {
        this.p = v
        this.#updateQ()
    }

    moveBy(v: Vec, map: MapData, { frame = 5 }: { frame?: number } = {}) {
        // vから尤もらしい方向を取得
        if (v.x === 1 && v.y === 0) this.direction = 1
        else if (v.x === 0 && v.y === 1) this.direction = 0
        else if (v.x === -1 && v.y === 0) this.direction = 3
        else if (v.x === 0 && v.y === -1) this.direction = 2

        const w = map.getRealWall()

        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                if (w[this.p.y + v.y + i]?.[this.p.x + v.x + j] === 1) return Array()
            }
        }

        this.p = this.p.add(v)

        const g = function* (this: Sprite) {
            this.state = "walking"

            const q = this.q
            const l = this.p.scale(TILE_SIZE).sub(q)

            for (let i = 0; i < frame; i++) {
                this.q = q.add(l.scale((i + 1) / frame))
                this.walkFrame++
                if (i === frame - 1) this.state = "standing"
                yield
            }
        }.bind(this)()

        this.gs.push(g)

        return g
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        const map = [...Array(7).fill(1), ...Array(3).fill(0), ...Array(7).fill(2), ...Array(3).fill(0)]

        const w = this.walkFrame % map.length

        if (this.image.length > 0) {
            const img =
                this.preState === "standing" && this.state === "standing"
                    ? this.image[this.direction]?.[0] ?? this.image[0][0]
                    : this.image[this.direction]?.[map[w]] ?? this.image[0][0]

            ctx.drawImage(img, this.q.x, this.q.y, this.size.x * TILE_SIZE, this.size.y * TILE_SIZE)
        } else {
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2

            ctx.beginPath()
            ctx.strokeRect(this.q.x, this.q.y, this.size.x * TILE_SIZE, this.size.y * TILE_SIZE)
            ctx.stroke()
        }

        ctx.restore()
    }
}
