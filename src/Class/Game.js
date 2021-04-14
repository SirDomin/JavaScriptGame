class Game extends Engine {
    constructor(canvas) {
        super(canvas);

        this.devMode = true;
        this.canvas.setDimensions('500', '500');
        this.pause = false;
    }

    update() {
    }
}
