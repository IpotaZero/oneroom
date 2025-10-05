import { EventSerif } from "../Events/EventSerif"
import { MapData } from "../Game/MapData"
import { Scene } from "../Game/Scene"
import { vec } from "../utils/Vec"
import { Sprite, SpriteOption } from "./Sprite"

export class SpriteCreature extends Sprite {
    frame = 0

    constructor(scene: Scene, option: SpriteOption & { serif?: string[] }) {
        super(scene, option)

        if (option.serif) {
            this.action = () => new EventSerif(scene, option.serif!)
        }
    }

    update(scene: Scene): void {
        super.update(scene)

        if (this.state === "standing" && this.frame++ % 30 === 0) {
            this.moveBy([vec(1, 0), vec(0, 1), vec(-1, 0), vec(0, -1)][Math.floor(Math.random() * 4)], scene.map)
        }
    }
}
