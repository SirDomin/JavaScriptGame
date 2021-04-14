class Sprite {
    constructor(image, numberOfSprites = 1, imageWidth, imageHeight, animationSpeed = 1) {
        this.image = new Image();
        this.numberOfSprites = numberOfSprites - 1;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.animationSpeed = 3;
        this.currentState = 0;
        this.state = 0;
        this.ready = false;
        this.imageY = 0;

        this.image.onload = () => {
            this.ready = true;
        }

        this.image.src =  `src/assets/img/${image}.png`;
    }

    animate = (ctx, x, y, width, height) => {
        this.state = this.state % this.animationSpeed + 1;
        if (this.state % this.animationSpeed == 0) {
            this.currentState = (this.currentState % this.numberOfSprites) +1;
        }
        ctx.drawImage(this.image, this.imageWidth * this.currentState, 0, this.imageWidth, this.imageHeight, x, y, width, height)
    }

    drawSingle = (ctx, imageX, imageY, imageWidth, imageHeight, x, y, width, height) => {
        ctx.drawImage(this.image, imageX, imageY, imageWidth, imageHeight, x, y, width, height);
    }
}
