class GameObject {
    static COLLISION_TYPE_BOX = 1;
    static COLLISION_TYPE_CIRCLE = 2;

    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.removeOnOutOfBound = false;
        this.type = EntityTypes.TYPE_DEFAULT_OBJECT;
        this.collisionType = GameObject.COLLISION_TYPE_BOX;
        this.collisionChecks = 0;
        this.id = game.generateId();
        this.color = 'rgb(255,0,0)';
        this.speed = (6) * (Math.random() + 0.1);
        this.target = null;
    }

    update(canvas) {
        if (this.target) {
            this.x += -(this.speed) * Math.cos(Math.atan2(this.target.y - this.y, this.x - this.target.x));
            this.y += (this.speed) * Math.sin(Math.atan2(this.target.y - this.y, this.x - this.target.x));
        }
    }

    render(canvas) {
        canvas.draw(this.x, this.y, this.width, this.height, this.color);
    }
    
    getMidPoint() {
        return new Point(this.x + this.width / 2, this.y + this.height / 2);
    }

    onClick() {
        if(game.devMode === true) {
           game.debug(this);
        }
    }

    moveTo(x, y) {
        this.target = new Point(x, y);
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
