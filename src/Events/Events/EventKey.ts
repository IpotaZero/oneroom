import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"

export class EventKey extends GameEvent {
    #keyColor

    constructor(scene: Scene, keyColor: string) {
        super(scene)
        this.#keyColor = keyColor
    }

    *G(scene: Scene) {
        const door = scene.map.realSprites.find((s) => s.id === "door")!
        const player = scene.map.player

        if (!door.getExistsP().some((p) => p.equals(player.getDirectedP()))) {
            yield* this.say(["ここでは使えない。"])
            return
        }

        const num = yield* this.ask(["使う", "やめる"], { title: `${this.#keyColor}を使う?` })

        if (num === 0) {
            scene.items = scene.items.filter((c) => c.id !== this.#keyColor)
            scene.flags.push(`item-use-${this.#keyColor}`)
            yield* this.say([`${this.#keyColor}を使った。`])
        }
    }
}
