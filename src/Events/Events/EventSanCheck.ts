import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"
import EventGameOver from "./EventGameOver"

export default class EventSanCheck extends GameEvent {
    readonly #change: number

    constructor(scene: Scene, change: number) {
        super(scene)
        this.#change = change
    }

    *G(scene: Scene) {
        const san = scene.characters[0].status.san

        yield* this.say([`<span class="red">SAN: ${san} -> ${san + this.#change}</span>`])
        scene.characters[0].status.san += this.#change

        if (scene.characters[0].status.san <= 0) {
            yield* this.say([{ type: "character", url: "ユウナ.png" }, "あはは、", "もうどうなってもいいや。"])
            return [new EventGameOver(scene)]
        }
    }
}
