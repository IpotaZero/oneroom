import { Item } from "../../Game/Item"
import { Scene } from "../../Game/Scene"
import { Awaits } from "../../utils/Awaits"
import { GameEvent } from "../GameEvent"

export default class EventDoor extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent, void> {
        const chY = { type: "character", url: "ユウナ.png" } as const

        const keys = ["赤いカギ", "青いカギ", "緑のカギ", "黄色いカギ", "紫のカギ"]

        const isUsed = keys.some((k) => scene.flags.isSuperSetOf(`item-use-${k}`))

        if (isUsed) {
            const num = yield* this.ask(["抜く", "やめる"], { title: "カギを抜く?" })

            if (num === 0) {
                const { default: EventKey } = yield* Awaits.yield(import("./EventKey"))

                keys.forEach((k) => {
                    scene.flags.remove(`item-use-${k}`)

                    if (!scene.items.findById(k)) {
                        scene.items.add(new Item(k, () => new EventKey(scene, k)))
                    }
                })

                yield* this.say(["カギを抜いた。"])
            }

            return
        }

        yield* this.say(["カギがかかっている。", chY, "5個カギ穴がある!"])
    }
}
