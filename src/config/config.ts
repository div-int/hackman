import 'phaser';

export const config = {
  parent: 'Phaser3',
  type: Phaser.AUTO,

  backgroundColor: '#000000',
  height: window.innerHeight,
  width: window.innerWidth,

  pixelArt: true,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  physics: {
    default: 'arcade',

    arcade: {
      debug: true,
      tileBias: 8,
      gravity: { x: 0, y: 0 },
    },
  },
};
