import { Item } from "../../Game/Item"
import { Scene } from "../../Game/Scene"
import { EventKey } from "./EventKey"
import { GameEvent } from "../GameEvent"

export class EventDoor extends GameEvent {
    *G(scene: Scene) {
        const chY = { type: "character", url: "ユウナ.png" } as const

        const keys = ["赤いカギ", "青いカギ", "緑のカギ", "黄色いカギ", "紫のカギ"]

        const isUsed = keys.some((k) => scene.flags.includes(`item-use-${k}`))

        if (isUsed) {
            const num = yield* this.ask(["抜く", "やめる"], { title: "カギを抜く?" })

            if (num === 0) {
                keys.forEach((k) => {
                    scene.flags = scene.flags.filter((f) => f !== `item-use-${k}`)

                    if (!scene.items.find((i) => i.id === k)) {
                        scene.items.push(new Item(k, () => new EventKey(scene, k)))
                    }
                })

                yield* this.say(["カギを抜いた。"])
            }

            return
        }

        yield* this.say(["カギがかかっている。", chY, "5個カギ穴がある!"])
    }
}
