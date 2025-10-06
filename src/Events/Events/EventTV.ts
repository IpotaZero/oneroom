import { Scene } from "../../Game/Scene"
import { vec } from "../../utils/Vec"
import { GameEvent } from "../GameEvent"
import { EventDoor } from "./EventDoor"

export class EventTV extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent, void> {
        const player = scene.map.player

        if (player.direction !== 2) return

        if (scene.flags.includes("TV")) {
            yield* this.say(["砂嵐が流れている。"])
            return
        }

        const chN = { type: "character", url: "nwami.png" } as const
        const chY = { type: "character", url: "ユウナ.png" } as const

        if (player.p.equals(vec(2, 4))) {
            yield* player.moveBy(vec(1, 0), scene.map)
            player.direction = 2
        } else if (player.p.equals(vec(4, 4))) {
            yield* player.moveBy(vec(-1, 0), scene.map)
            player.direction = 2
        }

        const tv = scene.map.realSprites.find((s) => s.id === "tv")!

        tv.direction = 1

        yield* this.say([
            "ぴっ",
            chN,
            "やあ! お目覚めかな?",
            chY,
            "うわ、誰?",
            chN,
            "僕の名前はナ゛ミ! 君を連れてきた張本人さ!",
            chY,
            "なんで連れてきたんすか?",
            chN,
            "強いて言うなら......運命的出会い。",
            "君を一目見たシュンカン、『好きっ!』ってなっちゃったんだ!",
            chY,
            "帰りたいんですけどぉ。",
            chN,
            "だめでーす。",
            { type: "character", url: "none" },
            "ぷつん......",
        ])

        tv.direction = 2

        scene.map.player.direction = 0

        scene.flags.push("TV")
    }
}
