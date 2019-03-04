import { LineRenderer } from "./line-renderer";
import { Interaction } from "./interaction";
import { Vec2 } from "./vec2";

function start() {
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resize);
    resize();

    const interaction = new Interaction(canvas);
    const lineRenderer = new LineRenderer(canvas);

    function render() {
        lineRenderer.clear();

        interaction.storedLines.forEach((line, i) => {
            const padding = 10;
            const sampleSize = 50;
            const isMatching = interaction.matchingLine === line;

            lineRenderer.renderLine(line.normalized().scaled(50), {
                position: new Vec2(padding + i * (sampleSize + padding), padding),
                width: 2,
                color: isMatching ? "#f00" : "#000"
            })
        });

        lineRenderer.renderLine(interaction.line);

        requestAnimationFrame(render);
    }

    render();
}

window.onload = start;
