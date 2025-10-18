import { keyboard } from "../utils/Input"
import { vec } from "../utils/Vec"
import { MapData } from "../Game/MapData"
import { Scene } from "../Game/Scene"
import Sprite from "./Sprite"

export default class Player extends Sprite {
    protected override readonly animationFrameMap: ReadonlyArray<number> = [
        ...Array(12).fill(1),
        ...Array(6).fill(0),
        ...Array(12).fill(2),
        ...Array(6).fill(0),
    ]

    zIndex: number = 100

    constructor(scene: Scene) {
        super(scene, {
            id: "player",
            p: [9, 10],
            image: [
                [
                    { url: "ユウナ.png", p: [0, 0], size: [16, 16] },
                    { url: "ユウナ.png", p: [0, 16], size: [16, 16] },
                    { url: "ユウナ.png", p: [0, 32], size: [16, 16] },
                ],
                [
                    { url: "ユウナ.png", p: [16, 0], size: [16, 16] },
                    { url: "ユウナ.png", p: [16, 16], size: [16, 16] },
                    { url: "ユウナ.png", p: [16, 32], size: [16, 16] },
                ],
                [
                    { url: "ユウナ.png", p: [32, 0], size: [16, 16] },
                    { url: "ユウナ.png", p: [32, 16], size: [16, 16] },
                    { url: "ユウナ.png", p: [32, 32], size: [16, 16] },
                ],
                [
                    { url: "ユウナ.png", p: [48, 0], size: [16, 16] },
                    { url: "ユウナ.png", p: [48, 16], size: [16, 16] },
                    { url: "ユウナ.png", p: [48, 32], size: [16, 16] },
                ],
            ],
            size: [1, 1],
        })
    }

    override update(scene: Scene) {
        this.#walk(scene.map)
        super.update(scene)
    }

    #walk(map: MapData) {
        if (this.state === "animating") return

        const v = vec(0, 0)

        const latestKey = keyboard.getLatestKey((k) => k.startsWith("Arrow"))

        if (latestKey === "ArrowRight") v.x += 1
        else if (latestKey === "ArrowLeft") v.x -= 1
        else if (latestKey === "ArrowDown") v.y += 1
        else if (latestKey === "ArrowUp") v.y -= 1

        if (v.magnitude() === 0) return

        this.moveBy(v, map, { frame: 5 })
    }
}
