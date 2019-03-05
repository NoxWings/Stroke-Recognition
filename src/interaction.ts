import { Vec2 } from "./vec2";
import { Line } from "./line";
import { matcher } from "./matcher";

export class Interaction {
    public line: Line = new Line();
    public matchingLine: Line = new Line();
    public storedLines: Line[] = [];

    private isDrawing: boolean = false;
    private interactionTimeout: NodeJS.Timeout | null = null;

    constructor(canvas: HTMLCanvasElement, public minimumStrokeLength = 5) {
        canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
        canvas.addEventListener("mousedown", this.onDown.bind(this));

        canvas.addEventListener("mousemove", this.onMove.bind(this));
        canvas.addEventListener("touchmove", this.onTouchMove.bind(this));

        canvas.addEventListener("touchend", this.end.bind(this));
        canvas.addEventListener("mouseup", this.end.bind(this));
        canvas.addEventListener("mouseleave", this.end.bind(this));

        window.addEventListener("keypress", this.onKeyPress.bind(this));
    }

    private onDown(evt: MouseEvent) {
        evt.preventDefault();
        this.start(evt.x, evt.y);
    }

    private onTouchStart(evt: TouchEvent) {
        evt.preventDefault();
        const { clientX, clientY } = evt.touches[0];
        this.start(clientX, clientY);
    }

    private onTouchMove(evt: TouchEvent) {
        evt.preventDefault();
        const { clientX, clientY } = evt.touches[0];
        this.move(clientX, clientY);
    }

    private onMove(evt: MouseEvent) {
        evt.preventDefault();
        this.move(evt.x, evt.y);
    }

    private start(x: number, y: number) {
        const newPoint = new Vec2(x, y);
        this.line = new Line([newPoint]);
        this.isDrawing = true;
        this.startLongPressTimeout();
    }

    private move(x: number, y: number) {
        if (!this.isDrawing) { return; }

        const lastPoint = this.line.lastPoint;
        const newPoint = new Vec2(x, y);

        if (lastPoint && lastPoint.distance(newPoint) >= this.minimumStrokeLength) {
            this.startLongPressTimeout();
            this.line.points.push(newPoint);
        }
    }

    private end() {
        this.stopLongPressTimeout();

        if (this.storedLines.length > 0) {
            const scores = this.storedLines.map(referenceLine =>
                matcher(referenceLine, this.line)
            );

            const mathingIndex = scores.indexOf(Math.min(...scores));
            this.matchingLine = this.storedLines[mathingIndex];
        }

        this.isDrawing = false;
    }

    private onKeyPress(evt: KeyboardEvent) {
        if (evt.key !== "Enter") { return; }
        this.storeLine();
    }

    private storeLine() {
        this.storedLines.push(this.line);
    }

    private startLongPressTimeout() {
        this.stopLongPressTimeout();
        this.interactionTimeout = setTimeout(this.storeLine.bind(this), 1000);
    }
    private stopLongPressTimeout() {
        if (this.interactionTimeout) {
            clearTimeout(this.interactionTimeout);
        }
    }
}
