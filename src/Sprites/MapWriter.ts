import { keyboard } from "../utils/Input"
import { vec } from "../utils/Vec"
import { MapData } from "../Game/MapData"
import { Sprite } from "./Sprite"

export class MapWriter extends Sprite {
    currentTileId = 0

    override update(map: MapData) {
        this.#walk(map)

        if (keyboard.pressed.has("Enter")) {
            map.tiles[this.p.y][this.p.x] = this.currentTileId
            map.setup()
        }

        if (keyboard.pushed.has("ShiftLeft")) {
            map.walls[this.p.y][this.p.x] = 1 - map.walls[this.p.y][this.p.x]
            map.setup()
        }

        if (keyboard.pushed.has("KeyS")) {
            console.log(JSON.stringify(map.json()))
        }

        if (keyboard.pushed.has("Space")) {
            this.currentTileId = map.tiles[this.p.y][this.p.x]
        }

        super.update()
    }

    #walk(map: MapData) {
        if (this.state === "walking") return

        const v = vec(0, 0)

        if (keyboard.longPressed.has("ArrowRight")) v.x += 1
        else if (keyboard.longPressed.has("ArrowLeft")) v.x -= 1
        else if (keyboard.longPressed.has("ArrowDown")) v.y += 1
        else if (keyboard.longPressed.has("ArrowUp")) v.y -= 1

        if (v.magnitude() === 0) return

        this.moveTo(this.p.add(v))
    }
}
