import { Scene } from "../Game/Scene"
import { vec } from "../utils/Vec"
import { GameEvent } from "./GameEvent"

export class EventFirst extends GameEvent {
    *G(scene: Scene) {
        yield* this.say(["character", "ユウナ.png", "ん......ここぁ"])

        const player = scene.map.player

        player.direction = 1
        yield* Array(15)
        player.direction = 2
        yield* Array(15)
        player.direction = 3
        yield* Array(15)
        player.direction = 4
        yield* Array(15)

        yield* this.say(["character", "ユウナ.png", "どこらぁ?"])
    }
}
