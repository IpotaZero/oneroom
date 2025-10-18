import { Item } from "../../Game/Item"
import { Scene } from "../../Game/Scene"
import { Awaits } from "../../utils/Awaits"
import { GameEvent } from "../GameEvent"
import EventSanCheck from "./EventSanCheck"

export default class EventTrash extends GameEvent {
    *G(scene: Scene) {
        yield* this.say(["動くゴミ箱。"])

        if (scene.flags.isSuperSetOf("item-get-カギ")) {
            return
        }

        const chY = { type: "character", url: "ユウナ.png" } as const

        yield* this.say([
            chY,
            "ゴミの中に何かある!",
            { type: "character", url: "none" },
            '<span class="blue">カギ</span>を見つけた。',
        ])

        scene.flags.add("item-get-カギ")

        const keys = ["赤いカギ", "青いカギ", "緑のカギ", "黄色いカギ", "紫のカギ"]

        const { default: EventKey } = yield* Awaits.yield(import("./EventKey"))

        keys.forEach((k) => scene.items.add(new Item(k, () => new EventKey(scene, k))))

        yield new EventSanCheck(scene, -1)
    }
}
