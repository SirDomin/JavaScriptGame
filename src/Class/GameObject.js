class GameObject {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = 2;
        this.removeOnOutOfBound = false;
        this.type = EntityTypes.TYPE_DEFAULT_OBJECT;
        this.collisionChecks = 0;
        this.id = game.generateId();
    }

    update(canvas) {
    }

    render(canvas) {
        canvas.draw(this.x, this.y, this.width, this.height);
    }

    collide(object) {
        game.removeObject(this.id);
    }

    checkCollision(object) {
        this.collisionChecks++;
        return (
            this.x + this.width >= object.x &&
            this.x <= object.x + object.width &&
            this.y + this.height >= object.y &&
            this.y <= object.y + object.height
        );
    }
}
