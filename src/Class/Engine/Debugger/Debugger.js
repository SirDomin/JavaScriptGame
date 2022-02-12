class Debugger {
    constructor() {
        this.object = null;
    }

    debug(object) {
        this.object = object;
    }

    displayData(data) {
        document.getElementById('debug-object').innerHTML = JSON.stringify(data, undefined, 4);
    }

    update = () => {
        if (this.object) {
            this.displayData(game.getObjectById(this.object.id));
        }
    }
}
