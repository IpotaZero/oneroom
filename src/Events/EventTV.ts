import { Scene } from "../Game/Scene"
import { GameEvent } from "./GameEvent"

export class EventTV extends GameEvent {
    *G(scene: Scene) {
        if (scene.flags.includes("TV")) {
            yield* this.say(["砂嵐が流れている。"])
            return
        }

        yield* this.say([
            "character",
            "none",
            "ぴっ",
            "character",
            "nwami.png",
            "やあ! お目覚めかな?",
            "character",
            "ユウナ.png",
            "うわ、誰?",
            "character",
            "nwami.png",
            "僕の名前はナ゛ミ! 君を連れてきた張本人さ!",
            "character",
            "ユウナ.png",
            "なんで連れてきたんすか?",
            "character",
            "nwami.png",
            "強いて言うなら......運命的出会い。",
            "君を一目見た瞬間、『好きっ!』ってなっちゃったんだ!",
            "character",
            "ユウナ.png",
            "帰りたいんですけどぉ。",
            "character",
            "nwami.png",
            "だめでーす。",
            "character",
            "none",
            "ぷつん......",
        ])

        scene.map.player.direction = 0

        scene.flags.push("TV")
    }
}
