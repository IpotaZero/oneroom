import { Scene } from "../../Game/Scene"
import { vec } from "../../utils/Vec"
import { GameEvent } from "../GameEvent"

export default class EventFirst extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent[], void> {
        yield* Array(30)

        yield* this.say([{ type: "character", url: "ユウナ.png" }, "ん......ここぁ"])

        const player = scene.map.player

        player.direction = 1
        yield* Array(15)
        player.direction = 2
        yield* Array(15)
        player.direction = 3
        yield* Array(15)
        player.direction = 0
        yield* Array(15)

        yield* this.say([{ type: "character", url: "ユウナ.png" }, "どこらぁ?"])
    }
}
