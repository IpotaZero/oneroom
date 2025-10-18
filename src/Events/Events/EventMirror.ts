import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"
import EventSanCheck from "./EventSanCheck"

export default class EventMirror extends GameEvent {
    *G(scene: Scene) {
        yield* this.say(["鏡だ。", { type: "character", url: "ユウナ.png" }, "私が映ってない!"])

        if (scene.flags.isSuperSetOf("sanc.鏡")) {
            return
        }

        scene.flags.add("sanc.鏡")

        return [new EventSanCheck(scene, -1)]
    }
}
