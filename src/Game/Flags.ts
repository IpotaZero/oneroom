export class Flags {
    #flags: string[] = []

    /**
     *
     * @param flags
     * @returns すべてのフラグを持っているかどうか
     */
    isSuperSetOf(...flags: string[]): boolean {
        return flags.every((f) => this.#flags.includes(f))
    }

    /**
     *
     * @param flags
     * @returns 指定した順番で全てのフラグが存在するかどうか
     */
    isSuperSequenceOf(...flags: string[]): boolean {
        let idx = 0
        for (const flag of flags) {
            idx = this.#flags.indexOf(flag, idx)
            if (idx === -1) return false
            idx++
        }
        return true
    }

    /**
     * 指定したフラグを追加します。既に存在するフラグは追加されません。
     * @param flags 追加するフラグのリスト
     */
    add(...flags: string[]) {
        flags.forEach((f) => {
            if (!this.#flags.includes(f)) {
                this.#flags.push(f)
            }
        })
    }

    /**
     * 指定したフラグを削除します
     * @param flags 削除するフラグのリスト
     */
    remove(...flags: string[]) {
        this.#flags = this.#flags.filter((f) => !flags.includes(f))
    }
}
