export class Character {
    name: string
    icon: string

    status: {
        lv: number
        hp: number
        mp: number
        san: number
    } = {
        lv: 9,
        hp: 24,
        mp: 0,
        san: 20,
    }

    constructor(name: string, icon: string) {
        this.name = name
        this.icon = icon
    }
}
