import { Scene } from "../../Game/Scene"
import { GameEvent } from "../GameEvent"

export default class EventHowToPlay extends GameEvent {
    *G(scene: Scene): Generator<void, void | GameEvent[], void> {
        scene.cvs.style.display = "none"

        const panel = document.createElement("div")
        panel.id = "how-to-play-panel"
        panel.className = "hidden"
        panel.innerHTML = `
            <h2>操作方法</h2>
            
            <p>矢印キーで移動</p>
            <p>[ Z ]で調べる</p>
            <p>[ X ]でメニュー/キャンセル</p>
            <p>セーブは無いです</p>

            <p class="continue text-end">[ Z ]で続ける</p>
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
