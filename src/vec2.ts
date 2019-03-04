export class Vec2 {
    constructor(public x: number = 0, public y: number = 0) {}

    public addScalar (scalar: number) { return new Vec2(this.x + scalar, this.y + scalar); }
    public subScalar (scalar: number) { return new Vec2(this.x - scalar, this.y - scalar); }
    public multiplyScalar (scalar: number) { return new Vec2(this.x * scalar, this.y * scalar); }
    public divideScalar (scalar: number) { return new Vec2(this.x / scalar, this.y / scalar); }

    public add (other: Vec2) { return new Vec2(this.x + other.x, this.y + other.y); }
    public sub (other: Vec2) { return new Vec2(this.x - other.x, this.y - other.y); }
    public multiply (other: Vec2) { return new Vec2(this.x * other.x, this.y * other.y); }
    public divide (other: Vec2) { return new Vec2(this.x / other.x, this.y / other.y); }

    public dot (other: Vec2) { return this.x * other.x + this.y * other.y; }
    public distance (other: Vec2) { return this.sub(other).length(); }

    public length () { return Math.sqrt(this.x * this.x + this.y * this.y); }
    public negate () { return new Vec2(-this.x, -this.y); }
    public normalized () {
        const length = this.length();
        return new Vec2(this.x / length, this.y / length);
    }
}
