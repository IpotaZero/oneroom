import { Item } from "../../Game/Item"
import { Scene } from "../../Game/Scene"
import { EventKey } from "./EventKey"
import { GameEvent } from "../GameEvent"

export class EventTrash extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent, void> {
        if (scene.flags.includes("item-get-カギ")) {
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

        scene.flags.push("item-get-カギ")

        const keys = ["赤いカギ", "青いカギ", "緑のカギ", "黄色いカギ", "紫のカギ"]

        keys.forEach((k) => scene.items.push(new Item(k, () => new EventKey(scene, k))))
    }
}
