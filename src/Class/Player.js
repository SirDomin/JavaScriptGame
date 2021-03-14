class Player extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 2;
        this.lastShot = 0;
        this.bulletCooldown = 2;
        this.type = EntityTypes.TYPE_PLAYER;
    }

    update(canvas) {
        super.update(canvas);
    }

    render(canvas) {
        super.render(canvas);
        canvas.write('XD', this.x, this.y - 5);
    }

    moveLeft = () => {
        this.x -= this.speed;
    }

    moveRight = () => {
        this.x += this.speed;
    }

    shot = () => {
        if (this.canShot()) {
            this.lastShot = game.getTicks();
            game.addObject(new Bullet(this, {width: 2, height: 2}));
        }
    }

    canShot = () => {
        return game.getTicks() >= this.lastShot + this.bulletCooldown;
    }
}
