let game = new Game(new Canvas('#game-container'))

let player = new Player(250, 420, 50, 50);


game.addKeyHandler(39, player.moveRight);
game.addKeyHandler(37, player.moveLeft);
game.addKeyHandler(32, player.shot);

game.addObject(player);

let objWidth = 3;
let margin = 1;
for(let x = 0; x < 500; x+= (objWidth + margin)) {
    for( let y = 0; y < 300; y+= (objWidth+ margin)) {
        game.addObject(new GameObject(x + margin, y + margin, objWidth, objWidth))
    }
}

game.run();
