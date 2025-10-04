import { Events } from "../Events/Events"
import { GameEvent } from "../Events/GameEvent"
import { MapData } from "../Game/MapData"
import { Sprite, SpriteOption } from "./Sprite"

export class SpriteEvent extends Sprite {
    constructor(map: MapData, option: SpriteOption & { event: string }) {
        super(map, option)

        this.action = () => {
            return new Events[option.event](map)
        }
    }
}
