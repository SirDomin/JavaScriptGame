class Bullet extends GameObject {
    constructor(parent, rect) {
        super(parent.x + parent.width / 2 - rect.width / 2, parent.y - 4, rect.width, rect.height);
        this.removeOnOutOfBound = true;
        this.speed = 5;
        this.color = 'rgb(0,255,0)'
        this.type = EntityTypes.TYPE_BULLET;
        this.collidesWith = EntityTypes.TYPE_DEFAULT_OBJECT;
    }

    update(canvas) {
        super.update();
        this.y -= this.speed / 3;
        this.checkCollisions(this.collidesWith);
    }

    render(canvas) {
        canvas.draw(this.x, this.y, this.width, this.height, this.color);
    }

    collide(object) {
        super.collide(object);
    }

    checkCollisions(type) {
        game.gameObjects.filter(object => {
            return (
                object.type === type &&
                game.inRange(object, this)
            )
        } ).forEach(obj => {
            if (obj.checkCollision(this)) {
                obj.collide(this);
                this.collide(obj);
            }
        })
    }
}
