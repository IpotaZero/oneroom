import { Events } from "../Events/Events"
import { Scene } from "../Game/Scene"
import { Sprite, SpriteOption } from "./Sprite"

export class SpriteEvent extends Sprite {
    constructor(scene: Scene, option: SpriteOption & { event: string }) {
        super(scene, option)

        this.action = () => {
            return new Events[option.event](scene)
        }
    }
}
