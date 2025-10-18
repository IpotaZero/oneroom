import { Input, keyboard } from "./utils/Input"

import { Scene } from "./Game/Scene"
import { Itext } from "./utils/Itext"

Itext

Input.init()

const scene = new Scene()
await scene.ready

let last = performance.now()

const mainLoop = () => {
    if (keyboard.pushed.includes("F5")) {
        location.reload()
    } else if (keyboard.pushed.includes("F11")) {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            document.body.requestFullscreen()
        }
    }

    if (performance.now() - last >= 32) {
        last = performance.now()
        scene.update()
        Input.update()
    }

    // try {
    // } catch (error) {
    //     console.error(error)
    //     alert((error as Error).message)
    // }

    requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)
