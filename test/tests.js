// tests.js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

console.log("tests.js");

(async function() {
  global.dom = await JSDOM.fromFile("test/phaser.html", {
    // To run the scripts in the html file
    runScripts: "dangerously",
    // Also load supported external resources
    resources: "usable",
    // So requestAnimatinFrame events fire
    pretendToBeVisual: true,
  });
})();
