import { EventDoor } from "./Events/EventDoor"
import { EventTrash } from "./Events/EventTrash"
import { EventTV } from "./Events/EventTV"
import { GameEvent } from "./GameEvent"

export const Events: Record<string, typeof GameEvent> = {
    "tv": EventTV,
    "door": EventDoor,
    "trash": EventTrash,
}
