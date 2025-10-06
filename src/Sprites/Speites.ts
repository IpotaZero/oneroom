import { SpriteSerif } from "./SpriteSerif"
import { Sprite } from "./Sprite"
import { SpriteEvent } from "./SpriteEvent"
import { SpriteBox } from "./SpriteBox"

export const Sprites: Record<string, typeof Sprite> = {
    "object": Sprite,
    "serif": SpriteSerif,
    "event": SpriteEvent,
    "box": SpriteBox,
}
