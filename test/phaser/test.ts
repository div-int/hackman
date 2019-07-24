console.log("phaser/test.ts");

let preload = () => {
  console.log("preload");
};
let create = () => {
  console.log("preload");
};
let update = () => {
  console.log("preload");
};

var game = new Phaser.Game({
  type: Phaser.HEADLESS,
  parent: "game",
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
  width: 800,
  height: 600,
});
