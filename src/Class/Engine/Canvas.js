class Canvas{
    constructor(container) {
        this.container = document.querySelector(container);
        this.width = 0;
        this.height = 0;
        this.createCanvas('500px', '500px');
        this.defaultColor = 'white';
        this.defaultFont = "Arial";
        this.defaultFontSize = "20px";
        this.currentColor = 'white';
    }

    createCanvas(width, height) {
        this.canvas = document.createElement('canvas')
        this.canvas.style = 'border:solid 1px black';
        this.canvas.style.width = width;
        this.canvas.style.height = height;
        this.container.append(this.canvas);
        this.context = this.canvas.getContext('2d');
    }

    write = (text, x, y) => {
        this.context.fillStyle = this.defaultColor;
        this.context.fillText(text, x, y);
    }

    setFillColor = (color = this.defaultColor) => {
        this.context.fillStyle = color;
    }

    setFont = (font = this.defaultFont, size = this.defaultFontSize) => {
        this.context.font = `${font} ${size}`;
    }

    draw = (x = 0, y = 0, w = 0, h = 0, color = 'red') => {
        if (this.currentColor !== color) {
            this.context.fillStyle = color;
        }
        this.context.fillRect(x, y, w, h);
    }

    clear() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    setDimensions(width, height) {
        this.width = width;
        this.height = height;

        this.canvas.width = width;
        this.canvas.height = height;
    }

    addListener(type, callback) {
        document.addEventListener(type, callback);
    }
}
