import { DrawInteraction, DrawInteractionEvents } from "./draw_interaction";
import { Line } from "./line";
import { LineRenderer } from "./line_renderer";
import { matcher } from "./matcher";
import { UI } from "./ui";
import { Vec2 } from "./vec2";

class Example {
    private ui: UI = new UI();
    private lineRenderer = new LineRenderer(this.ui.canvas);
    private drawInteraction = new DrawInteraction(this.ui.canvas);
    private sampledLines: Line[] = [];
    private matchingLine: Line | null = null;

    constructor() {
        const lineDrawEvent = DrawInteractionEvents.LINE_DRAWN;

        this.drawInteraction.on(lineDrawEvent, this.executeMatching.bind(this));
        this.ui.addButton.addEventListener("click", this.addSample.bind(this));
    }

    public render() {
        this.lineRenderer.clear();

        this.renderSamples();

        this.lineRenderer.renderLine(this.drawInteraction.line);

        requestAnimationFrame(() => this.render());
    }

    private renderSamples() {
        const padding = 10;
        const size = 50;
        const totalSize = padding + size;
        const getXPosition = (i: number) => padding + i * totalSize;

        this.sampledLines.forEach((line, i) => {
            const sampleLine = line.normalized().scaled(size);
            const position = new Vec2(getXPosition(i), padding);
            const color = (this.matchingLine === line) ? "#f00" : "#000";

            this.lineRenderer.renderLine(sampleLine, { position, color, width: 2 });
        });

        this.ui.addButton.style.left = `${getXPosition(this.sampledLines.length)}px`;
    }

    private executeMatching(line: Line) {
        if (!this.sampledLines.length) { return; }

        const scores = this.sampledLines.map(sampleLine => matcher(sampleLine, line));
        const mathingIndex = scores.indexOf(Math.min(...scores));
        this.matchingLine = this.sampledLines[mathingIndex];
    }

    private addSample() {
        const { line } = this.drawInteraction;
        if (line && line.points.length > 1) {
            this.sampledLines.push(line);
            this.drawInteraction.clearLine();
        }
    }
}

window.onload = () => {
    const example = new Example();
    example.render();
};
