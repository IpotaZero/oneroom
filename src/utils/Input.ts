export class Input {
    static isAvailable = true

    static keyboard = {
        pressed: new Array<Input.KeyCode>(),
        longPressed: new Array<Input.KeyCode>(),
        pushed: new Array<Input.KeyCode>(),
        upped: new Array<Input.KeyCode>(),
        getLatestKey(filter: (key: Input.KeyCode) => boolean = () => true) {
            return this.pressed.filter(filter).at(-1)
        },
    }

    static mouse = {
        position: { x: 0, y: 0 },
        clicked: new Set<Input.MouseButton>(),
        upped: new Set<Input.MouseButton>(),
        down: new Set<Input.MouseButton>(),
        about: new Set<Input.Direction>(),
    }

    static focusState = {
        isFocused: true,
        justFocused: false,
        justBlurred: false,
    }

    static #initialized = false

    /**
     * 最初に呼んでくれ
     */
    static init() {
        if (this.#initialized) throw new Error("Input is already initialized!")
        this.#initialized = true

        document.addEventListener("contextmenu", (e) => {
            // 右クリックメニューを無効化
            e.preventDefault()
            e.stopPropagation()
        })

        document.addEventListener("pointerdown", this.#handleTouchStart.bind(this), { passive: false })
        document.addEventListener("pointermove", this.#handleTouchMove.bind(this), { passive: false })
        document.addEventListener("pointerleave", this.#handleTouchEnd.bind(this), { passive: false })
        document.addEventListener("pointercancel", this.#handleTouchEnd.bind(this), { passive: false })

        // Keyboard events
        window.addEventListener("keydown", this.#handleKeyDown.bind(this))
        window.addEventListener("keyup", this.#handleKeyUp.bind(this))

        // Window focus events
        window.addEventListener("blur", this.#handleBlur.bind(this))
        window.addEventListener("focus", this.#handleFocus.bind(this))
        document.addEventListener("visibilitychange", this.#handleVisibilityChange.bind(this))
    }

    /**
     * 毎フレームの最後に呼んでくれ
     */
    static update() {
        if (!this.#initialized) console.error("Input is not initialized!")

        this.keyboard.longPressed = []
        this.keyboard.pushed = []
        this.keyboard.upped = []

        this.mouse.clicked.clear()
        this.mouse.upped.clear()

        this.focusState.justFocused = false
        this.focusState.justBlurred = false

        if (!this.isAvailable) {
            this.mouse.down.clear()
            this.keyboard.pressed = []
        }
    }

    static #handleKeyDown(e: KeyboardEvent) {
        if (e.code === "Tab") {
            // Tabキーのデフォルト動作を無効化
            e.preventDefault()
        }

        if (e.code.includes("Arrow")) {
            e.preventDefault()
        }

        if (!this.isAvailable) return

        if (!this.keyboard.pressed.includes(e.code as Input.KeyCode)) {
            this.keyboard.pushed.push(e.code as Input.KeyCode)
            this.keyboard.pressed.push(e.code as Input.KeyCode)
        }

        this.keyboard.longPressed.push(e.code as Input.KeyCode)
    }

    static #handleKeyUp(e: KeyboardEvent) {
        if (!this.isAvailable) return

        if (e.code.includes("Arrow")) {
            e.preventDefault()
        }

        this.keyboard.pressed = this.keyboard.pressed.filter((k) => k !== e.code)
        this.keyboard.upped.push(e.code as Input.KeyCode)
    }

    static #handleTouchStart(e: PointerEvent) {
        if (!this.isAvailable) return

        // this.mouse.position.x = e.target.clientX
        // this.mouse.position.y = touch.clientY
        // this.mouse.down.add("left")
        // this.mouse.clicked.add("left")
        this.#handleMousePosition()
    }

    static #handleTouchMove(e: PointerEvent) {
        if (!this.isAvailable) return

        // if (e.touches.length > 0) {
        //     const touch = e.touches[0]
        //     this.mouse.position.x = touch.clientX
        //     this.mouse.position.y = touch.clientY
        //     this.#handleMousePosition()
        // }
    }

    static #handleTouchEnd(e: PointerEvent) {
        if (!this.isAvailable) return

        this.mouse.down.delete("left")
        this.mouse.upped.add("left")
    }

    static #handleMousePosition() {
        this.mouse.about.clear()

        // クリック位置によって方向を pressing に追加
        const { x, y } = this.mouse.position
        const width = window.innerWidth
        const height = window.innerHeight

        if (x < width / 3) this.mouse.about.add("left")
        else if (x > (width * 2) / 3) this.mouse.about.add("right")

        if (y < height / 3) this.mouse.about.add("up")
        else if (y > (height * 2) / 3) this.mouse.about.add("down")

        // center: x, y が中央1/3領域にある場合
        if (x >= width / 3 && x <= (width * 2) / 3 && y >= height / 3 && y <= (height * 2) / 3) {
            this.mouse.about.add("center")
        }
    }

    static #handleBlur() {
        console.log("よそ見するにゃ!")
        this.focusState.isFocused = false
        this.focusState.justBlurred = true
    }

    static #handleFocus() {
        console.log("こっち見んにゃ!")
        this.focusState.isFocused = true
        this.focusState.justFocused = true
    }

    static #handleVisibilityChange() {
        if (document.visibilityState === "visible") {
            this.#handleFocus()
        } else {
            this.#handleBlur()
        }
    }
}

export namespace Input {
    export type MouseButton = (typeof Input.mouseButtons)[number]
    export type KeyCode = (typeof Input.keys)[number]

    export const mouseButtons = ["left", "middle", "right", "back", "forward"] as const
    export const keys = [
        "KeyA",
        "KeyB",
        "KeyC",
        "KeyD",
        "KeyE",
        "KeyF",
        "KeyG",
        "KeyH",
        "KeyI",
        "KeyJ",
        "KeyK",
        "KeyL",
        "KeyM",
        "KeyN",
        "KeyO",
        "KeyP",
        "KeyQ",
        "KeyR",
        "KeyS",
        "KeyT",
        "KeyU",
        "KeyV",
        "KeyW",
        "KeyX",
        "KeyY",
        "KeyZ",
        "Digit0",
        "Digit1",
        "Digit2",
        "Digit3",
        "Digit4",
        "Digit5",
        "Digit6",
        "Digit7",
        "Digit8",
        "Digit9",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "Enter",
        "Escape",
        "Backspace",
        "Tab",
        "Space",
        "ShiftLeft",
        "ShiftRight",
        "ControlLeft",
        "ControlRight",
        "AltLeft",
        "AltRight",
        "MetaLeft",
        "MetaRight",
        "CapsLock",
        "NumLock",
        "ScrollLock",
        "Insert",
        "Delete",
        "Home",
        "End",
        "PageUp",
        "PageDown",
        "F1",
        "F2",
        "F3",
        "F4",
        "F5",
        "F6",
        "F7",
        "F8",
        "F9",
        "F10",
        "F11",
        "F12",
        "ContextMenu",
        "Pause",
        "PrintScreen",
    ] as const

    export const directions = ["left", "right", "up", "down", "center"] as const
    export type Direction = (typeof directions)[number]
}

export const { keyboard, focusState, mouse } = Input
