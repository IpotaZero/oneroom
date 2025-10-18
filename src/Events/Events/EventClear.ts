import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"

export default class EventGameOver extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent[], void> {
        const panel = document.createElement("span")
        panel.style.position = "absolute"
        panel.style.width = "100%"
        panel.style.height = "100%"
        panel.style.backgroundColor = "white"
        panel.style.opacity = "0"
        panel.style.transition = "opacity 3s"

        scene.container.appendChild(panel)

        requestAnimationFrame(() => {
            panel.style.opacity = "1"
        })

        yield* Array(90)

        yield* this.say([
            "気づくと自分の部屋のベットの上だった。",
            "部屋は何事もなかったかのように静まり返っている。",
            "机の上には見知らぬ箱が置いてある。",
            "そんなものなどお構いなしに、窓からは朝日が差し込んでいた。",
            "End",
        ])

        window.close()
    }
}
