import { MapData } from "../Game/MapData"
import { Scene } from "../Game/Scene"
import { Player } from "../Sprites/Player"
import { vec } from "../utils/Vec"
import { GameEvent } from "./GameEvent"

export class EventFirst extends GameEvent {
    *G(scene: Scene) {
        yield* this.say(["ん......ここぁ"])

        const player = scene.map.player

        player.direction = 1
        yield* Array(15)
        player.direction = 2
        yield* Array(15)
        player.direction = 3
        yield* Array(15)
        player.direction = 0
        yield* Array(15)

        yield* this.say(["どこらぁ?"])
    }
}
