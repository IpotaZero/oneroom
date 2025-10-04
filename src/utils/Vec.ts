export const vec = (x: number, y: number) => new Vec(x, y)

export class Vec {
    constructor(public x: number, public y: number) {}

    add(v: Vec) {
        return new Vec(this.x + v.x, this.y + v.y)
    }

    sub(v: Vec) {
        return new Vec(this.x - v.x, this.y - v.y)
    }

    scale(s: number) {
        return new Vec(this.x * s, this.y * s)
    }

    rot(radian: number) {
        const c = Math.cos(radian)
        const s = Math.sin(radian)
        return new Vec(this.x * c - this.y * s, this.x * s + this.y * c)
    }

    dot(v: Vec) {
        return this.x * v.x + this.y * v.y
    }

    normalize() {
        const l = this.magnitude()

        if (l === 0) return new Vec(0, 0)

        return this.scale(1 / l)
    }

    magnitude() {
        return Math.hypot(this.x, this.y)
    }

    normal() {
        return new Vec(-this.y, this.x)
    }

    equals(v: Vec) {
        return this.x === v.x && this.y === v.y
    }
}
