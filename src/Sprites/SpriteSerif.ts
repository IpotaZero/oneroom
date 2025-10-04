import { EventSerif } from "../Events/EventSerif"
import { MapData } from "../Game/MapData"
import { Sprite, SpriteOption } from "./Sprite"

export class SpriteSerif extends Sprite {
    constructor(map: MapData, option: SpriteOption & { serif: string[] }) {
        super(map, option)

        this.action = () => {
            return new EventSerif(map, [...option.serif])
        }
    }
}
