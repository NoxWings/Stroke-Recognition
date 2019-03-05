import { Vec2 } from "./vec2";
import { Line } from "./line";
import EventEmitter from "eventemitter3";

export enum DrawInteractionEvents {
    LINE_DRAWN = "LINE_DRAWN"
}

export class DrawInteraction extends EventEmitter<DrawInteractionEvents> {
    public line: Line = new Line();
    private isDrawing: boolean = false;

    constructor(canvas: HTMLCanvasElement, public minimumStrokeLength = 5) {
        super();

        canvas.addEventListener("touchstart", this.onTouchStart.bind(this));
        canvas.addEventListener("mousedown", this.onDown.bind(this));

        canvas.addEventListener("mousemove", this.onMove.bind(this));
        canvas.addEventListener("touchmove", this.onTouchMove.bind(this));

        canvas.addEventListener("touchend", this.end.bind(this));
        canvas.addEventListener("mouseup", this.end.bind(this));
        canvas.addEventListener("mouseleave", this.end.bind(this));
    }

    public clearLine() {
        this.line = new Line();
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
        this.clearLine();
        this.line.points.push(new Vec2(x, y));
        this.isDrawing = true;
    }

    private move(x: number, y: number) {
        if (!this.isDrawing) { return; }

        const lastPoint = this.line.lastPoint;
        const newPoint = new Vec2(x, y);

        if (lastPoint && lastPoint.distance(newPoint) >= this.minimumStrokeLength) {
            this.line.points.push(newPoint);
        }
    }

    private end() {
        this.emit(DrawInteractionEvents.LINE_DRAWN, this.line);
        this.isDrawing = false;
    }
}
