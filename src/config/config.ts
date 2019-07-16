export default {
  type: Phaser.AUTO,
  parent: "Phaser3",
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: "#000000",
  pixelArt: false,
  roundPixels: false,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
      gravity: { x: 0, y: 0 }
    }
  }
};
