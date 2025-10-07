import { Item } from "../../Game/Item"
import { Scene } from "../../Game/Scene"
import { Awaits } from "../../utils/Awaits"
import { GameEvent } from "../GameEvent"

export default class EventTrash extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent, void> {
        if (scene.flags.isSuperSetOf("item-get-カギ")) {
            yield* this.say(["動くゴミ箱。"])
            return
        }

        const chY = { type: "character", url: "ユウナ.png" } as const

        yield* this.say([
            "動くゴミ箱。",
            chY,
            "ゴミの中に何かある!",
            { type: "character", url: "none" },
            "カギを見つけた。",
        ])

        scene.characters.forEach((c) => (c.status.san -= 1))

        scene.flags.add("item-get-カギ")

        const keys = ["赤いカギ", "青いカギ", "緑のカギ", "黄色いカギ", "紫のカギ"]

        const { default: EventKey } = yield* Awaits.yield(import("./EventKey"))

        keys.forEach((k) => scene.items.add(new Item(k, () => new EventKey(scene, k))))
    }
}
