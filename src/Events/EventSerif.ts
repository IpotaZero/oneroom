import { Scene } from "../Game/Scene"
import { GameEvent, SayCommand } from "./GameEvent"

export class EventSerif extends GameEvent {
    #texts: (string | SayCommand)[]

    constructor(scene: Scene, texts: (string | SayCommand)[]) {
        super(scene)
        this.#texts = texts
    }

    *G(): Generator<void, void | GameEvent[], void> {
        yield* this.say(this.#texts)
    }
}
