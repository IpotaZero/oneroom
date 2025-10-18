import EventSanCheck from "../Events/Events/EventSanCheck"
import { EventSerif } from "../Events/EventSerif"
import { GameEvent } from "../Events/GameEvent"
import { Scene } from "../Game/Scene"
import Sprite, { SpriteOption } from "./Sprite"

export default class SpriteChair extends Sprite {
    protected state: "animating" | "standing" = "animating"

    constructor(scene: Scene, options: SpriteOption) {
        super(scene, options)

        this.action = (scene) => {
            const events: GameEvent[] = [
                new EventSerif(scene, [
                    "時計の針が目まぐるしく回転している。",
                    { type: "character", url: "ユウナ.png" },
                    "目が回っちゃう......。",
                ]),
            ]

            if (!scene.flags.isSuperSetOf("sanc.時計")) {
                events.push(new EventSanCheck(scene, -1))
            }

            scene.flags.add("sanc.時計")

            return events
        }
    }
}
