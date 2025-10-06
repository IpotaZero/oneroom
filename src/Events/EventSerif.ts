import { Scene } from "../Game/Scene"
import { GameEvent } from "./GameEvent"

export class EventSerif extends GameEvent {
    #texts: string[]

    constructor(scene: Scene, texts: string[]) {
        super(scene)
        this.#texts = texts
    }

    *G(): Generator<void, void | GameEvent, void> {
        yield* this.say(this.#texts)
    }
}
