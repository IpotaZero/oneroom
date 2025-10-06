import { Scene } from "../../Game/Scene"
import { vec } from "../../utils/Vec"
import { GameEvent } from "../GameEvent"

export class EventHowToPlay extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent, void> {
        scene.cvs.style.display = "none"

        const panel = document.createElement("div")
        panel.id = "how-to-play-panel"
        panel.className = "hidden"
        panel.innerHTML = `
            <h2>How to Play</h2>
            
            <p>Use the arrow keys to move your character around the map.</p>
            <p>Press the [Z] to interact with objects.</p>
            <p>Press the [X] to open the menu and cancel actions.</p>

            <p class="continue text-end">[Z] to continue</p>
        `

        scene.container.appendChild(panel)

        requestAnimationFrame(() => {
            panel.classList.remove("hidden")
        })

        yield* this.wait()

        panel.classList.add("hidden")
        panel.addEventListener("transitionend", () => {
            panel.remove()
        })

        scene.cvs.style.display = ""
    }
}
