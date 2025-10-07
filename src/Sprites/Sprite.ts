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
    collision?: boolean
    visible?: boolean
}

export default class Sprite {
    static readonly #directions = [vec(0, 1), vec(1, 0), vec(0, -1), vec(-1, 0)]

    static #getDirectionFromVec(v: Vec): number {
        if (v.x === 1 && v.y === 0) return 1
        if (v.x === 0 && v.y === 1) return 0
        if (v.x === -1 && v.y === 0) return 3
        if (v.x === 0 && v.y === -1) return 2
        return 0
    }

    static #setupImage(images: ImageOption[][]): HTMLCanvasElement[][] {
        return images.map((directionImg) =>
            directionImg.map((img) => {
                const baseImage = new Image()
                baseImage.src = `assets/images/sprites/${img.url}`
                const canvas = document.createElement("canvas")
                canvas.width = img.size[0]
                canvas.height = img.size[1]
                const ctx = canvas.getContext("2d")!
                baseImage.onload = () => {
                    ctx.drawImage(
                        baseImage,
                        img.p[0],
                        img.p[1],
                        img.size[0],
                        img.size[1],
                        0,
                        0,
                        img.size[0],
                        img.size[1],
                    )
                }
                return canvas
            }),
        )
    }

    static #creatureBehavior(scene: Scene) {
        return function* (this: Sprite) {
            while (true) {
                const dir = Math.floor(Math.random() * 4)
                const pos = Sprite.#directions[dir]
                yield* this.moveBy(pos, scene.map)
                yield* Array(25)
            }
        }
    }

    static #walkGenerator(frame: number) {
        return function* (this: Sprite) {
            this.state = "walking"
            const startQ = this.q
            const delta = this.p.scale(TILE_SIZE).sub(startQ)

            for (let i = 0; i < frame; i++) {
                this.q = startQ.add(delta.scale((i + 1) / frame))
                this.#walkFrame++
                if (i === frame - 1) {
                    this.state = "standing"
                    this.#coolTime = 2
                }
                yield
            }
        }
    }

    readonly id: string
    readonly image: HTMLCanvasElement[][]

    p: Vec
    q: Vec
    size: Vec
    direction = 0
    visible = true
    collision: boolean = true

    protected gs: Generator[] = []
    protected state: "walking" | "standing" = "standing"

    #coolTime = 0
    #walkFrame = 0

    constructor(
        scene: Scene,
        { id, p, image, size, creature = false, collision = true, visible = true }: SpriteOption,
    ) {
        this.id = id
        this.size = vec(...size)
        this.image = Sprite.#setupImage(image)

        this.p = vec(...p)
        this.q = this.p.scale(TILE_SIZE)
        this.collision = collision
        this.visible = visible

        if (creature) {
            this.gs.push(Sprite.#creatureBehavior(scene).bind(this)())
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()

        const frameMap = [...Array(6).fill(1), ...Array(3).fill(0), ...Array(6).fill(2), ...Array(3).fill(0)]
        const w = this.#walkFrame % frameMap.length

        if (this.image.length > 0) {
            const img =
                this.state === "standing" && this.#coolTime === 0
                    ? this.image[this.direction]?.[0] ?? this.image[0][0]
                    : this.image[this.direction]?.[frameMap[w]] ?? this.image[0][0]

            ctx.drawImage(img, this.q.x, this.q.y, this.size.x * TILE_SIZE, this.size.y * TILE_SIZE)
        } else {
            ctx.strokeStyle = "black"
            ctx.lineWidth = 2
            ctx.strokeRect(this.q.x, this.q.y, this.size.x * TILE_SIZE, this.size.y * TILE_SIZE)
        }

        ctx.restore()
    }

    update(scene: Scene) {
        this.gs = this.gs.filter((g) => !g.next().done)
        if (this.#coolTime > 0) this.#coolTime--
    }

    action(scene: Scene): GameEvent | void {}

    moveTo(v: Vec) {
        this.p = v
        this.#updateQ()
    }

    moveBy(v: Vec, map: MapData, { frame = 5 }: { frame?: number } = {}) {
        this.direction = Sprite.#getDirectionFromVec(v)

        const wall = map.getRealWall()
        if (!this.#canMove(v, wall)) return Array()

        this.p = this.p.add(v)

        const g = Sprite.#walkGenerator(frame).bind(this)()
        this.gs.push(g)
        return g
    }

    getDirectedP(): Vec {
        return this.p.add(Sprite.#directions[this.direction])
    }

    *getExistsP() {
        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                yield this.p.add(vec(j, i))
            }
        }
    }

    #updateQ() {
        this.q = this.p.scale(TILE_SIZE)
    }

    #canMove(v: Vec, wall: number[][]): boolean {
        for (let i = 0; i < this.size.y; i++) {
            for (let j = 0; j < this.size.x; j++) {
                if (wall[this.p.y + v.y + i]?.[this.p.x + v.x + j] === 1) return false
            }
        }
        return true
    }
}
