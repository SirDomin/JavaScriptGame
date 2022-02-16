class Engine {
    constructor(canvas) {
        this.canvas = canvas;
        this.eventHandler = new EventHandler(canvas);
        this.gameObjects = [];
        this.ticks = 0;
        this.fps = 0;
        this.start = performance.now();
        this.indexesToRemove = [];
        this.pause = false;
    }

    addObject(gameObject) {
        this.gameObjects.push(gameObject);
    }

    addKeyHandler(keyCode, callback, single = false) {
        this.eventHandler.addKeyHandler(keyCode, callback, single);
    }

    render() {
        this.canvas.clear();
        this.gameObjects.forEach(gameObject => {
            gameObject.render(this.canvas);
        });
        this.canvas.renderScene();
    }

    run = () => {
        let now = performance.now();
        this.fps = Math.round(1000 / (now - this.start));
        this.start = now;
        this.ticks++;

        if(!this.pause) {
            this.render();
        }
        this.updateTick();
        this.handleRemovedObjects();
        requestAnimationFrame(this.run);
    }

    destroy = () => {
        this.run = function (){}
    }

    updateTick = () => {
        this.gameObjects.forEach(gameObject => {
            gameObject.update();
        });

        this.update();
        this.eventHandler.handleKeysDown();
        this.handleOutOfBound();
    }

    update = () => {

    }

    getData = () => {
        return {
            ticks: this.ticks,
            fps: this.fps,
            pause: this.pause,
            objects: this.gameObjects.length,
            renderingEngine: this.canvas.rendering
        }
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
    
    getTicks = () => {
        return this.ticks;
    }

    getObjectAt = (x, y) => {
        for(let i in this.gameObjects) {
            if(this.gameObjects[i].checkCollision({
                x: x,
                y: y,
                width: 1,
                height: 1
            })) {
                this.gameObjects[i].color = 'blue';
            }
        }
    }

    outOfBound = (object, x) => {
        if (object.removeOnOutOfBound) {
            this.removeObject(object.id);
        }
    }

    getObjectById = (id) => {
        return this.gameObjects.filter(object => object.id === id)[0] ?? {};
    }

    inRange = (object1, object2) => {
        return (object1.x + object1.width > object2.x && object1.x < object2.x + object2.width);
    }

    generateId = () => {
        return 'xxxxxxxxx'.replace(/[x]/g, char => {
            return Utils.random(0,9);
        })
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
}
