import { GameEvent } from "../Events/GameEvent"

export class Item {
    readonly id: string = "えらー"
    readonly event: () => GameEvent

    constructor(id: string, event: () => GameEvent) {
        this.id = id
        this.event = event
    }
}

export class Items {
    items: Item[] = []

    add(item: Item) {
        this.items.push(item)
    }

    removeById(id: string) {
        this.items = this.items.filter((i) => i.id !== id)
    }

    findById(id: string) {
        return this.items.find((i) => i.id === id)
    }
}
