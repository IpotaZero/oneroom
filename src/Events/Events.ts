import { EventTV } from "./EventTV"
import { GameEvent } from "./GameEvent"

export const Events: Record<string, typeof GameEvent> = {
    "tv": EventTV,
}
