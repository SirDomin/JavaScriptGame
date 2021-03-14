class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.gameObjects = [];
        this.keysDown = [];
        this.keyHandlers = [];
        this.ticks = 0;
        this.canvas.addListener('keydown', this.onKeyDown);
        this.canvas.addListener('keyup', this.onKeyUp);

        this.indexesToRemove = [];

        this.canvas.setDimensions('500', '500');
    }

    addObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    update = () => {
        this.handleKeysDown();
        this.gameObjects.forEach(gameObject => {
            gameObject.update();
        });
        this.handleOutOfBound();
    }

    render = () => {
        this.canvas.clear();
        this.gameObjects.forEach(gameObject => {
            gameObject.render(this.canvas);
        })
        this.canvas.write(`current object count: ${this.gameObjects.length}`, 250, 250);
    }

    run = () => {
        this.ticks++;
        this.render();
        this.update();

        this.handleRemovedObjects();
        requestAnimationFrame(this.run);
    }

    getTicks = () => {
        return this.ticks;
    }

    handleOutOfBound = () => {
        for(let x in this.gameObjects) {
            let object = this.gameObjects[x];
            if (object.x < 0) {
                object.x = 0;
            }
            if (object.x + object.width > this.canvas.width) {
                object.x = this.canvas.width - object.width;
            }
            if (object.y < 0) {
                this.outOfBound(object, x);

                object.y = 0;
            }
            if (object.y + object.height > this.canvas.height) {
                object.y = this.canvas.height - object.height;
            }
        }
    }

    outOfBound = (object, x) => {
        if (object.removeOnOutOfBound) {
            this.removeObject(object.id);
        }
    }

    inRange = (object1, object2) => {
        return (object1.x + object1.width > object2.x && object1.x < object2.x + object2.width);
    }

    generateId = () => {
        return 'xxxxxx'.replace(/[x]/g, char => {
            return parseInt(Math.random() * 10);
        })
    }

    handleKeysDown = () => {
        for (let x in this.keyHandlers) {
            if (this.keysDown[x]) {
                this.keyHandlers[x]();
            }
        }
    }

    addKeyHandler(keyCode, callback) {
        this.keyHandlers[keyCode] = callback;
    }

    removeObject(objectId) {
        let index = this.gameObjects.findIndex(object => object.id === objectId);
        this.indexesToRemove.push(index);
    }

    handleRemovedObjects = () => {
        let indexes = new Set(
            this.indexesToRemove.sort((a, b) => {
                return b-a
            })
        );

        indexes.forEach(index => {
            this.gameObjects.splice(index, 1);
        });

        this.indexesToRemove = [];
    }

    removeKeyHandler(keyCode) {
        delete this.keyHandlers[keyCode];
    }

    onKeyDown = (e) => {
        this.keysDown[e.keyCode] = true;
    }

    onKeyUp = (e) => {
        delete this.keysDown[e.keyCode];
    }
}
