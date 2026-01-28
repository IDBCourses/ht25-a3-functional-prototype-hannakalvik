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
  pressed: [], // Array that saves the key input - which keys has been pressed
  lastKey: "", // last key that was pressed
  progress: 0, // How many times the gesture is correct
  mode: "playing"
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

  if (state.mode === "finished") {
    return;
  }


  if (state.mode === "waiting" && key !== " ") {
    return;
  }

  state.lastKey = key;
  state.pressed.push(key); // puts the newest value last in the array

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
    if (state.pressed[i] !== settings.sequence[i]) { 
      correct = false; // when it finds a wrong key
    }
  }

  const statusEl = document.getElementById("status");
  const progressEl = document.getElementById("progress");

  if (!correct) { 
    state.pressed = []; // if wrong, start over
    statusEl.innerHTML = "Wrong key! Start over.";
    statusEl.style.color = "red";
  } else if (state.pressed.length < settings.sequence.length) {
    statusEl.innerHTML = "Swipe in progress...";
    statusEl.style.color = "white";
  }

  // if gesture is complete
  if (state.pressed.length === settings.sequence.length) {
    state.progress++;
    statusEl.innerHTML = "Gesture complete!";
    statusEl.style.color = "green";
    progressEl.innerHTML = "Progress: " + state.progress + " / " + settings.needed;
    state.pressed = []; // reset for next swipe

    // Show text under the door if needed progress reached
    if (state.progress >= settings.needed) {
      const doorText = document.getElementById("doorText");
      doorText.style.display = "block";
      doorText.innerHTML = "Press SPACE to open the door";

      state.mode = "waiting";
    }
  } 
} 


// Try open door
function tryOpen() {

  if (state.mode !== "waiting") {
    return;
  }
  const statusEl = document.getElementById("status");
  const progressEl = document.getElementById("progress");
  const door = document.getElementById("door");
  const doorText = document.getElementById("doorText");

  if (state.progress >= settings.needed) {
    door.style.backgroundColor = "yellow";
    doorText.innerHTML = "";
    statusEl.innerHTML = "Door opened! You escaped!";
    statusEl.style.color = "green";

    state.mode = "finished";

      state.progress = 0;
      progressEl.innerHTML = "Progress: " + state.progress + " / " + settings.needed;
  } else {
    statusEl.innerHTML = "Not enough charge yet. Keep swiping!";
    statusEl.style.color = "red";
  }
}

setup(); // Always remember to call setup()!
