/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// Settings
const settings = {
  sequence: ["a", "s", "d", "f", "g", "h", "j", "k", "l"]
};

//State
const state = {
  pressed [], // Array that saves the key input
  lastKey:"" 
};


// Code that runs over and over again
function loop() {

  window.requestAnimationFrame(loop);
}

// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {

  document.addEventListener("keydown", onKey);

  window.requestAnimationFrame(loop);
}

setup(); // Always remember to call setup()!