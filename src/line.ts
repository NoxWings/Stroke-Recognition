import { Vec2 } from "./vec2";

export class Line {
    constructor(public points: Vec2[] = []) {}

    public get firstPoint() {
        return this.points[0];
    }

    public get lastPoint() {
        return this.points[this.points.length - 1];
    }

    public get length() {
        return this.points.length;
    }

    public get segments() {
        if (this.points.length <= 1) { return []; }
        const result = [];

        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];
            result.push(p2.sub(p1));
        }

        return result;
    }

    public normalized() {
        const minPoint = new Vec2(Infinity, Infinity);
        const maxPoint = new Vec2(0, 0);

        this.points.forEach(p => {
            if (p.x < minPoint.x) { minPoint.x = p.x; }
            if (p.y < minPoint.y) { minPoint.y = p.y; }
            if (p.x > maxPoint.x) { maxPoint.x = p.x; }
            if (p.y > maxPoint.y) { maxPoint.y = p.y; }
        });

        const difference = maxPoint.sub(minPoint);
        const maxGap = Math.max(difference.x, difference.y);

        const normalizedPoints = this.points.map(({ x, y }) =>
            new Vec2(
                (x - minPoint.x) / maxGap,
                (y - minPoint.y) / maxGap
            )
        );

        return new Line(normalizedPoints);
    }

    public scaled(factor: number) {
        return new Line(this.points.map(p => p.multiplyScalar(factor)));
    }
}
