export class Itext extends HTMLElement {
    #interval
    #resolve!: () => void

    isFinished = false
    finished

    constructor(text?: string) {
        super()

        text && (this.innerHTML = text)

        // すべての子ノードのうち、textノードのみをIchar要素に置き換える（子要素の中まで再帰的に探索）
        const replaceTextNodes = (parent: Node) => {
            const childNodes = Array.from(parent.childNodes)

            for (const node of childNodes) {
                if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
                    const ichar = new Ichar(node.textContent)
                    parent.replaceChild(ichar, node)
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    replaceTextNodes(node)
                }
            }
        }

        this.finished = new Promise<void>((resolve) => (this.#resolve = resolve))

        replaceTextNodes(this)

        this.#interval = setInterval(() => this.update(), 1000 / 16)
    }

    update() {
        const ichars = Array.from(this.querySelectorAll("i-char")).filter((el): el is Ichar => el instanceof Ichar)

        for (const ichar of ichars) {
            if (!ichar.isFinished) {
                ichar.update()
                break
            }
        }

        // 全て終わったらintervalを止める
        if (ichars.every((ichar) => ichar.isFinished)) {
            clearInterval(this.#interval)
            this.#resolve()
            this.isFinished = true
            this.classList.add("text-end")
        }
    }

    finish() {
        const ichars = Array.from(this.querySelectorAll("i-char")).filter((el): el is Ichar => el instanceof Ichar)

        for (const ichar of ichars) {
            ichar.finish()
        }

        this.isFinished = true

        clearInterval(this.#interval)
        this.#resolve()
        this.classList.add("text-end")
    }
}

customElements.define("i-text", Itext)

class Ichar extends HTMLElement {
    #text: string
    #i = 0

    isFinished = false

    constructor(text?: string) {
        super()
        this.#text = text ?? this.textContent
        this.textContent = ""
    }

    update() {
        if (this.isFinished) return

        this.textContent += this.#text[this.#i++]

        if (this.#text.length <= this.#i) {
            this.isFinished = true
        }
    }

    finish() {
        this.textContent = this.#text
        this.isFinished = true
    }
}

customElements.define("i-char", Ichar)
