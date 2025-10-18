import { Scene } from "../../Game/Scene"
import { Awaits } from "../../utils/Awaits"
import { vec } from "../../utils/Vec"
import { GameEvent } from "../GameEvent"

export default class EventKey extends GameEvent {
    #keyColor

    constructor(scene: Scene, keyColor: string) {
        super(scene)
        this.#keyColor = keyColor
    }

    *G(scene: Scene): Generator<void, void | GameEvent[], void> {
        if (scene.map.id !== "room") {
            yield* this.say(["ここでは使えない。"])
            return
        }

        const door = scene.map.getSpriteById("door")
        const player = scene.map.player

        if (!door.getExistsP().some((p) => p.equals(player.getDirectedP()))) {
            yield* this.say(["ここでは使えない。"])
            return
        }

        const num = yield* this.ask(["使う", "やめる"], { title: `${this.#keyColor}を使う?` })

        if (num === 0) {
            scene.items.removeById(this.#keyColor)
            scene.flags.add(`item-use-${this.#keyColor}`)
            yield* this.say([`${this.#keyColor}を使った。`])

            const flags = ["黄色いカギ", "赤いカギ", "紫のカギ", "青いカギ", "緑のカギ"].map((k) => `item-use-${k}`)

            const allKeyAreUsed = scene.flags.isSuperSetOf(...flags)
            if (!allKeyAreUsed) return

            const isCorrectOrder = scene.flags.isSuperSequenceOf(...flags)

            if (isCorrectOrder) {
                yield* this.#clear(scene)
                const { default: EventClear } = yield* Awaits.yield(import("./EventClear"))
                return [new EventClear(scene)]
            } else {
                yield* this.#wrong(scene)
                const { default: EventGameOver } = yield* Awaits.yield(import("./EventGameOver"))
                return [new EventGameOver(scene)]
            }
        }
    }

    *#clear(scene: Scene) {
        const door = scene.map.getSpriteById("door")
        door.direction = 1
        door.size = vec(1, 3)
        door.collision = false

        yield* Array(15)

        yield* this.say([{ type: "character", url: "ユウナ.png" }, "お"])

        const player = scene.map.player

        yield* player.moveBy(vec(0, -1), scene.map, { frame: 15 })
        yield* player.moveBy(vec(0, -1), scene.map, { frame: 15 })

        yield* Array(30)

        door.direction = 0
        door.size = vec(1, 2)

        yield* Array(45)
    }

    *#wrong(scene: Scene) {
        const door = scene.map.getSpriteById("door")
        door.direction = 1
        door.size = vec(1, 3)
        door.collision = false

        yield* Array(15)

        yield* this.say([{ type: "character", url: "ユウナ.png" }, "お"])

        yield* Array(30)

        const player = scene.map.player

        yield* player.moveBy(vec(0, -1), scene.map, { frame: 15 })
        yield* player.moveBy(vec(0, -1), scene.map, { frame: 15 })

        yield* Array(30)

        door.direction = 0
        door.size = vec(1, 2)

        yield* Array(45)

        yield* this.say([{ type: "character", url: "ユウナ.png" }, "あ"])
    }
}
