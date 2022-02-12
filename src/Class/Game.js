class Game extends Engine {
    constructor(canvas) {
        super(canvas);

        this.devMode = true;
        this.canvas.setDimensions('500', '500');
        this.pause = false;
        this.debugger = new Debugger();
    }

    debug(object) {
        this.debugger.debug(object);
    }

    getData() {

    }

    update = () => {
        if (this.devMode === true) {
            this.debugger.update();

            document.getElementById('game-data').innerHTML = JSON.stringify(
                this.getData(),
                undefined, 4);
        }
    }
}
