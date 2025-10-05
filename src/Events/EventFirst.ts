import { MapData } from "../Game/MapData"
import { Scene } from "../Game/Scene"
import { Player } from "../Sprites/Player"
import { vec } from "../utils/Vec"
import { GameEvent } from "./GameEvent"

export class EventFirst extends GameEvent {
    *G(scene: Scene) {
        yield* this.say(["ん......ここぁ"])

        const player = scene.map.player

        yield* player.moveBy(vec(1, 0), scene.map, { frame: 15 })
        yield* player.moveBy(vec(0, 1), scene.map, { frame: 15 })
        yield* player.moveBy(vec(-1, 0), scene.map, { frame: 15 })
        yield* player.moveBy(vec(0, -1), scene.map, { frame: 15 })

        yield* this.say(["どこらぁ?"])
    }
}
