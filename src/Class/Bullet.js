class Bullet extends GameObject {
    constructor(parent, rect) {
        super(parent.x + parent.width / 2 - rect.width / 2, parent.y, rect.width, rect.height);
        this.removeOnOutOfBound = true;
        this.speed = 10;
        this.type = EntityTypes.TYPE_BULLET;
    }

    update(canvas) {
        this.y -= this.speed;
        this.checkCollisions(EntityTypes.TYPE_DEFAULT_OBJECT);
    }

    render(canvas) {
        super.render(canvas);
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
