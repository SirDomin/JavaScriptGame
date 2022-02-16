class Player extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height);
        this.speed = 2;
        this.lastShot = 0;
        this.bulletCooldown = 5;
        this.type = EntityTypes. TYPE_PLAYER;
        this.sprite = new Sprite('spider2', 8, 32, 32, 1);
    }

    update(canvas) {
    }

    render(canvas) {
        super.render(canvas);
        // this.sprite.animate(canvas.context, this.x, this.y, this.width, this.height);
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
            let bullet = new Bullet(this, {width: 5, height: 5});

            let enemy = game.gameObjects.filter(object => object.type === EntityTypes.TYPE_DEFAULT_OBJECT)[Math.floor(Math.random() * game.gameObjects.length)]

            if (enemy) {
                bullet.moveTo(enemy.x, enemy.y);
            }
            game.addObject(bullet);
        }
    }

    canShot = () => {
        return game.getTicks() >= this.lastShot + this.bulletCooldown;
    }
}
