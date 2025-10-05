import { vec, Vec } from "../utils/Vec"
import { TILE_SIZE } from "../Game/Constant"
import { MapData } from "../Game/MapData"
import { GameEvent } from "../Events/GameEvent"
import { Scene } from "../Game/Scene"

type ImageOption = { url: string; p: [number, number]; size: [number, number] }

export type SpriteOption = {
    p: [number, number]
    image: ImageOption[]
    size: [number, number]
}

export class Sprite {
    p: Vec = vec(0, 0)
    q: Vec = vec(0, 0)
    size: Vec = vec(1, 1)
    state: "walking" | "standing" = "standing"
    direction: number = 0
    image: HTMLCanvasElement[] = []

    gs: Generator[] = []

    constructor(scene: Scene, { p, image, size }: SpriteOption) {
        this.p = vec(p[0], p[1])
        this.#updateQ()
        this.size = vec(size[0], size[1])

        this.image = this.#setupImage(image)
    }

    getDirectedP() {
        const d = [vec(0, 1), vec(1, 0), vec(0, -1), vec(-1, 0)]
        return this.p.add(d[this.direction])
    }

    #setupImage(images: ImageOption[]) {
        return images.map((img) => {
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
        })
    }

    #updateQ() {
        this.q = this.p.scale(TILE_SIZE)
    }

    update(scene: Scene) {
        this.gs = this.gs.filter((g) => !g.next().done)
    }

    action(...args: unknown[]): GameEvent | void {}

    moveTo(v: Vec) {
        this.p = v
        this.#updateQ()
    }

    moveBy(v: Vec, map: MapData) {
        // vから尤もらしい方向を取得
        if (v.x === 1 && v.y === 0) this.direction = 1
        else if (v.x === 0 && v.y === 1) this.direction = 0
        else if (v.x === -1 && v.y === 0) this.direction = 3
        else if (v.x === 0 && v.y === -1) this.direction = 2

        const w = map.getRealWall()

        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                if (w[this.p.y + v.y + i]?.[this.p.x + v.x + j] === 1) return
            }
        }

        this.p = this.p.add(v)

        this.gs.push(
            function* (this: Sprite) {
                this.state = "walking"

                const q = this.q
                const l = this.p.scale(TILE_SIZE).sub(q)

                for (let i = 0; i < 3; i++) {
                    this.q = q.add(l.scale((i + 1) / 3))

                    if (i === 2) this.state = "standing"

                    yield
                }
            }.bind(this)(),
        )
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        if (this.image.length > 0) {
            ctx.drawImage(
                this.image[this.direction] ?? this.image[0],
                this.q.x,
                this.q.y,
                this.size.x * TILE_SIZE,
                this.size.y * TILE_SIZE,
            )
        }

        // ctx.strokeStyle = "black"
        // ctx.lineWidth = 2

        // ctx.beginPath()
        // ctx.strokeRect(this.q.x, this.q.y, this.size.x * TILE_SIZE, this.size.y * TILE_SIZE)
        // ctx.stroke()

        ctx.restore()
    }
}
