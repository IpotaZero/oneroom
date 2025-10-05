import { EventSerif } from "../Events/EventSerif"
import { Scene } from "../Game/Scene"
import { Sprite, SpriteOption } from "./Sprite"

export class SpriteSerif extends Sprite {
    constructor(scene: Scene, option: SpriteOption & { serif: string[] }) {
        super(scene, option)

        this.action = () => {
            return new EventSerif(scene, [...option.serif])
        }
    }
}
