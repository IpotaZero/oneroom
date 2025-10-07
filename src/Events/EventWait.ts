import { Scene } from "../Game/Scene"
import { Awaits } from "../utils/Awaits"
import { GameEvent } from "./GameEvent"

export class EventWait extends GameEvent {
    #promise

    constructor(scene: Scene, promise: Promise<GameEvent>) {
        super(scene)
        this.#promise = promise
    }

    *G() {
        return yield* Awaits.yield(this.#promise)
    }
}
