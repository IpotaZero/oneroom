import { SpriteSerif } from "./SpriteSerif"
import { Sprite } from "./Sprite"
import { SpriteEvent } from "./SpriteEvent"
import { SpriteCreature } from "./SpriteCreature"

export const Sprites: Record<string, typeof Sprite> = {
    "object": Sprite,
    "serif": SpriteSerif,
    "event": SpriteEvent,
    "creature": SpriteCreature,
}
