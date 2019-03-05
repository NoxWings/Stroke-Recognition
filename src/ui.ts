export class UI {
    public readonly canvas: HTMLCanvasElement;
    public readonly addButton: HTMLButtonElement;

    constructor() {
        this.canvas = document.createElement("canvas");
        this.addButton = document.createElement("button");
        this.addButton.id = "addButton";

        document.body.appendChild(this.canvas);
        document.body.appendChild(this.addButton);

        window.addEventListener("resize", this.resize.bind(this));
        this.resize();
    }

    private resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}
