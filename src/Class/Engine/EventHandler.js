class EventHandler {
    constructor(canvas){
        this.canvas = canvas;
        this.keysDown = [];
        this.keyHandlers = [];

        canvas.addListener('keydown', this.onKeyDown);
        canvas.addListener('keyup', this.onKeyUp);
        canvas.addListener('mousedown', this.onMouseDown);
    }

    handleKeysDown = () => {
        for (let x in this.keyHandlers) {
            if (this.keysDown[x]) {
                this.keyHandlers[x].callback();
                if(this.keyHandlers[x].single) {
                    delete this.keysDown[x];
                }
            }
        }
    }

    addKeyHandler(keyCode, callback, single = false) {
        this.keyHandlers[keyCode] = {
            callback: callback,
            single: single
        };
    }
    
    onKeyDown = (e) => {
        this.keysDown[e.keyCode] = true;
    }

    onKeyUp = (e) => {
        delete this.keysDown[e.keyCode];
    }

    onMouseDown = (e) => {
        var rect = this.canvas.canvas.getBoundingClientRect();
        let x = e.pageX - rect.x;
        let y = e.pageY - rect.y;

        game.gameObjects.
        filter(object => object.checkCollision(new Point(x, y)))
        .forEach(object => {
            object.onClick();
        })
    }
    
    removeKeyHandler(keyCode) {
        delete this.keyHandlers[keyCode];
    }
}