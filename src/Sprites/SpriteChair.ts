import EventSanCheck from "../Events/Events/EventSanCheck"
import { EventSerif } from "../Events/EventSerif"
import { GameEvent } from "../Events/GameEvent"
import { Scene } from "../Game/Scene"
import { vec } from "../utils/Vec"
import Sprite, { SpriteOption } from "./Sprite"

export default class SpriteChair extends Sprite {
    constructor(scene: Scene, options: SpriteOption) {
        super(scene, options)

        this.action = (scene) => {
            const direction = [
                [0, 1],
                [1, 0],
                [0, -1],
                [-1, 0],
            ][scene.map.player.direction]

            if (scene.map.isWall(this.p.add(vec(direction[0], direction[1])))) {
                const events: GameEvent[] = [
                    new EventSerif(scene, [
                        { type: "character", url: "椅子.png" },
                        "あなたは壁に向かって私を押すのですか。",
                        "鬼畜め。",
                        { type: "character", url: "ユウナ.png" },
                        "ひえ。",
                    ]),
                ]

                if (!scene.flags.isSuperSetOf("sanc.椅子")) {
                    events.push(new EventSanCheck(scene, -2))
                }

                scene.flags.add("sanc.椅子")

                this.collision = false

                return events
            } else {
                this.moveBy(vec(direction[0], direction[1]), scene.map)
            }
        }
    }
}
