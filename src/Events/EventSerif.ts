import { MapData } from "../Game/MapData"
import { GameEvent } from "./GameEvent"

export class EventSerif extends GameEvent {
    #texts: string[]

    constructor(map: MapData, texts: string[]) {
        super(map)
        this.#texts = texts
    }

    *G() {
        yield* this.say(this.#texts)
    }
}
