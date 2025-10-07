import { Input } from "./utils/Input"

import { Scene } from "./Game/Scene"
import { Itext } from "./utils/Itext"

Itext

Input.init()

let frame = 0

const scene = new Scene()
await scene.ready

const mainLoop = () => {
    if (frame++ % 2 !== 0) {
        requestAnimationFrame(mainLoop)
        return
    }

    try {
        scene.update()
    } catch (error) {
        alert((error as Error).message)
    }

    requestAnimationFrame(mainLoop)
}

requestAnimationFrame(mainLoop)
