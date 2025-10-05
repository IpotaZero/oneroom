import { keyboard } from "../utils/Input"
import { vec } from "../utils/Vec"
import { Sprite } from "./Sprite"
import { Scene } from "../Game/Scene"
import { TILE_SIZE } from "../Game/Constant"

export class MapWriter extends Sprite {
    currentTileId = 0

    constructor(scene: Scene) {
        super(scene, { p: [6, 6], image: [], size: [1, 1] })
    }

    override update(scene: Scene) {
        this.#walk()

        if (keyboard.pressed.has("Enter")) {
            scene.map.tiles[this.p.y][this.p.x] = this.currentTileId
            scene.map.setup(scene)
        }

        if (keyboard.pushed.has("ShiftLeft")) {
            scene.map.walls[this.p.y][this.p.x] = 1 - scene.map.walls[this.p.y][this.p.x]
            scene.map.setup(scene)
        }

        if (keyboard.pushed.has("KeyS")) {
            console.log(JSON.stringify(scene.map.json()))
        }

        if (keyboard.pushed.has("Space")) {
            this.currentTileId = scene.map.tiles[this.p.y][this.p.x]
        }

        super.update(scene)
    }

    #walk() {
        if (this.state === "walking") return

        const v = vec(0, 0)

        if (keyboard.longPressed.has("ArrowRight")) v.x += 1
        else if (keyboard.longPressed.has("ArrowLeft")) v.x -= 1
        else if (keyboard.longPressed.has("ArrowDown")) v.y += 1
        else if (keyboard.longPressed.has("ArrowUp")) v.y -= 1

        if (v.magnitude() === 0) return

        this.moveTo(this.p.add(v))
    }

    draw(ctx: CanvasRenderingContext2D) {
        super.draw(ctx)

        ctx.strokeStyle = "black"
        ctx.lineWidth = 2

        ctx.beginPath()
        ctx.strokeRect(this.q.x, this.q.y, this.size.x * TILE_SIZE, this.size.y * TILE_SIZE)
        ctx.stroke()
    }
}
