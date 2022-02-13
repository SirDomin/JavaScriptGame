function load(game) {
    let player = new Player(250, 420, 50, 50);

    game.addObject(player);
    game.addKeyHandler(39, player.moveRight);
    game.addKeyHandler(37, player.moveLeft);
    game.addKeyHandler(32, player.shot);
    game.addKeyHandler(69, () => {
        game.pause = !game.pause;
    }, true);
}

function reload() {
    if (game) {
        game.destroy();
    }

    document.getElementById('game-container').innerHTML = '';

    let canvas = new Canvas('#game-container');
    game = new Game(canvas);
    load(game)

    let objWidth = parseInt(document.getElementById('game-objects-width').value);
    let margin = parseFloat(document.getElementById('game-objects-margin').value);
    for(let x = 0; x < 500; x+= (objWidth + margin)) {
        for( let y = 0; y < 300; y+= (objWidth+ margin)) {
            game.addObject(new GameObject(x + margin, y + margin, objWidth, objWidth))
        }
    }

    game.run();
}
let game = false;

// reload();

document.getElementById('game-objects-margin').oninput = () => {
    reload();
}
document.getElementById('game-objects-width').oninput = () => {
    reload();
}

document.getElementById('restart-button').onclick = () => {
   reload();
}

window.addEventListener('load', function() {
   reload();
})