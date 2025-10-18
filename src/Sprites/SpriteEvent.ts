import { Scene } from "../Game/Scene"
import Sprite, { SpriteOption } from "./Sprite"

export default class SpriteEvent extends Sprite {
    constructor(scene: Scene, option: SpriteOption & { event: string }) {
        super(scene, option)

        this.action = () => {
            const EventClass = scene.map.eventMap.get(option.event)

            if (!EventClass) throw new Error(`イベントが見つからなかったにゃ...... イベントID: ${option.event}`)

            return [new EventClass(scene)]
        }
    }
}
