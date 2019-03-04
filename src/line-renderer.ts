import { Vec2 } from "./vec2";
import { Line } from "./line";

interface LineRenderOptions {
    position?: Vec2
    color?: string
    width?: number
}

export class LineRenderer {
    private height: number = 0;
    private width: number = 0
    private ctx: CanvasRenderingContext2D;

    constructor(private canvas: HTMLCanvasElement) {
        const provisionalCtx = canvas.getContext("2d");
        if (provisionalCtx) {
            this.ctx = provisionalCtx;
        } else {
            throw new Error("2d context not found");
        }

        this.canvas.addEventListener("resize", this.onResize.bind(this));
        this.onResize();
    }

    public clear () {
        this.ctx.clearRect(0, 0, this.width, this.height);
    }

    public renderLine(line: Line, options: LineRenderOptions = {}) {
        if (line.points.length <= 1) return;

        const position = options.position || new Vec2();
        this.ctx.strokeStyle = options.color || "#000";
        this.ctx.fillStyle = options.color || "#000";
        this.ctx.lineWidth = options.width || 5;

        this.ctx.beginPath();

        const firstPoint = line.firstPoint.add(position);
        this.ctx.arc(firstPoint.x, firstPoint.y, this.ctx.lineWidth * 2, 0, 2 * Math.PI, false);
        this.ctx.fill();

        for (let i = 0; i < line.points.length - 1; i++) {
            const p1 = line.points[i].add(position);
            const p2 = line.points[i + 1].add(position);

            this.ctx.moveTo(p1.x, p1.y);
            this.ctx.lineTo(p2.x, p2.y);
        }

        this.ctx.stroke();
    }

    private onResize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
}
