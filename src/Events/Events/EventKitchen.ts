import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"
import EventSanCheck from "./EventSanCheck"

export default class EventKitchen extends GameEvent {
    *G(scene: Scene) {
        yield* this.say([
            "キッチン周りによく分からないねとねとが付いている。",
            { type: "character", url: "ユウナ.png" },
            "うええ......。",
        ])

        if (scene.flags.isSuperSetOf("sanc.キッチン")) {
            return
        }

        scene.flags.add("sanc.キッチン")

        return [new EventSanCheck(scene, -1)]
    }
}
