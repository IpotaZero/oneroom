import { GameEvent } from "../Events/GameEvent"

export class Item {
    readonly id: string = "えらー"
    readonly event: () => GameEvent

    constructor(id: string, event: () => GameEvent) {
        this.id = id
        this.event = event
    }
}
