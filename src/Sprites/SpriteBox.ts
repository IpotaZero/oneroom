import { Scene } from "../Game/Scene"
import { vec } from "../utils/Vec"
import Sprite, { SpriteOption } from "./Sprite"

export default class SpriteBox extends Sprite {
    constructor(scene: Scene, options: SpriteOption) {
        super(scene, options)

        this.action = (scene) => {
            const direction = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ][scene.map.player.direction]

            this.moveBy(vec(direction[0], direction[1]), scene.map)
        }
    }
}
