/*
 * IDB Programming: Code Playground
 *
 */

import * as Util from "./util.js";

// Settings
const settings = {
  sequence: ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  needed: 3 // 3 completed swipes are needed
};

// State
const state = {
  pressed: [], // Array that saves the key input
  lastKey: "", 
  progress: 0 // How many times the gesture is correct
};

// Loop
function loop() {
  window.requestAnimationFrame(loop);
}

// Setup
function setup() {
  // Add event listener for key presses
  document.addEventListener("keydown", onKey);
  
  // Start the loop
  window.requestAnimationFrame(loop);
}

// Event handler
function onKey(event) {
  const key = event.key.toLowerCase(); // event.key = which key. toLowerCase() makes it case-insensitive
  state.lastKey = key;
  state.pressed.push(key); // puts the newest value last in the array

  console.log("Tangent tryckt: ", key); // ← här ser du varje tryck
  console.log("Array just nu: ", state.pressed);

  // Update log immediately
  document.getElementById("logg").innerHTML = state.pressed.join(", "); 

  // Check the gesture
  checkSwipe();

  // Simple button interaction
  if (key === " ") {
    tryOpen();
  }
}

// Logic for the keyboard inputs
function checkSwipe() { // check if the array is correct 
  let correct = true;

  // Loop through the pressed keys and compare with the expected sequence
  for (let i = 0; i < state.pressed.length; i++) {
    if (state.pressed[i] !== settings.sequence[i]) { // [i] = "hämta plats nummer i"
      correct = false; // when it finds some key that isn't in the array it turns true into false
    }
  }

  const statusEl = document.getElementById("status");
  const progressEl = document.getElementById("progress");

  if (!correct) { 
    state.pressed = []; // if it's false, empty the array and start over
    statusEl.innerHTML = "Wrong key! Start over.";
    statusEl.style.color = "red";
  } else if (state.pressed.length < settings.sequence.length) {
    statusEl.innerHTML = "Swipe in progress...";
    statusEl.style.color = "black";
  }

  // if gesture is complete
  if (state.pressed.length === settings.sequence.length) {
    state.progress++;
    statusEl.innerHTML = "Gesture complete!";
    statusEl.style.color = "green";
    progressEl.innerHTML =
        "Progress: " + state.progress + " / " + settings.needed;
    state.pressed = []; // if everything is correct in the array, the gesture is done, reset for the next swipe
  }
}

// Try open door
function tryOpen() {
  const statusEl = document.getElementById("status");
  const progressEl = document.getElementById("progress");

  if (state.progress >= settings.needed) {
    statusEl.innerHTML = "Door open! You escaped!";
    statusEl.style.color = "green";
    state.progress = 0;
    progressEl.innerHTML = "Progress: " + state.progress + " / " + settings.needed;
  } else {
    statusEl.innerHTML = "Not enough charge yet. Keep swiping!";
    statusEl.style.color = "red";
  }
}

setup(); // Always remember to call setup()!
