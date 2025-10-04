import { EventSerif } from "../Events/EventSerif"
import { MapData } from "../Game/MapData"
import { vec } from "../utils/Vec"
import { Sprite, SpriteOption } from "./Sprite"

export class SpriteCreature extends Sprite {
    frame = 0

    constructor(map: MapData, option: SpriteOption & { serif?: string[] }) {
        super(map, option)

        if (option.serif) {
            this.action = () => new EventSerif(map, option.serif!)
        }
    }

    update(map: MapData): void {
        super.update()

        if (this.state === "standing" && this.frame++ % 30 === 0) {
            this.moveBy([vec(1, 0), vec(0, 1), vec(-1, 0), vec(0, -1)][Math.floor(Math.random() * 4)], map)
        }
    }
}
