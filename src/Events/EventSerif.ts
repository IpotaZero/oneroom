import { Scene } from "../Game/Scene"
import { GameEvent } from "./GameEvent"

export class EventSerif extends GameEvent {
    #texts: string[]

    constructor(scene: Scene, texts: string[]) {
        super(scene)
        this.#texts = texts
    }

    *G() {
        yield* this.say(this.#texts)
    }
}
