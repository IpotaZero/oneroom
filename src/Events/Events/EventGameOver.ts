import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"

export default class EventGameOver extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent, void> {
        const panel = document.createElement("div")
        panel.id = "game-over-panel"
        panel.innerHTML = `
            <h1>Game Over</h1>
            <p class="text-end">[F5] to retry</p>

            <style>
                #game-over-panel {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: red;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
            </style>
        `
        scene.container.appendChild(panel)

        while (1) yield
    }
}
