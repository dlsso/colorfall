var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, '');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);
game.state.add('Play', Game.Play);
game.state.add('End', Game.End);

game.state.start('Boot');