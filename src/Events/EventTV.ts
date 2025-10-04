import { GameEvent } from "./GameEvent"

export class EventTV extends GameEvent {
    *G() {
        yield* this.say(["ぴっ"])
        yield* this.say(["やあ! お目覚めかな?", "僕の名前はナミ゛! 君を連れてきた張本人さ!"])
        yield* this.say(["なんで連れてきたんすか?"])
        yield* this.say(["強いて言うなら......運命的出会い。", "君を一目見た瞬間、『好きっ!』ってなっちゃったんだ。"])
        yield* this.say(["帰りたいんですけどぉ。"])
        yield* this.say(["だめでーす。"])
        yield* this.say(["ぷつん......"])
    }
}
