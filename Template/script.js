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

//State
const state = {
  pressed: [], // Array that saves the key input
  lastKey:"" ,
  progress: 0 //How many times the gesture is correct
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

// Event handler
function onKey(event) {
  const key = event.key.toLowerCase(); //event.key=which key .toLowerCase()=makes all the keys the same no matter if they are caps or not
  state.lastKey = key;
  state.pressed.push(key); //puts the newest value last in the array

  document.getElementById("logg").innerHTML = state.pressed.join(", "); //update the log immediatly 

  checkSwipe(); // logic - check the gesture
  if (key === " ") {
    tryOpen(); // simple button interaction
  }
}

// Logic for the keyboard inputs 
function checkSwipe() { //check if the array is correct 
  let correct = true;

  for (let i = 0; i < state.pressed.length; i++) {
    if (state.pressed[i] !== settings.sequence[i]) { // [i] = "hämta plats nummer i"
      correct = false; //when it finds some key that isn't in the array it turns true into false
   }
  }

  if (!correct) { 
    state.pressed = []; //if it's false, empty the array and start over
    const statusEl = document.getElementById("Status")
    statusEl.innerHTML = "Wrong key! Start over.";
    statusEl.style.color = "red";
  } else if (state.pressed.length < settings.sequence.length) {
    document.getElementById("status").innerHTML = "Swipe in progress...";
    document.getElementById("status").style.color = "black";
  }

  // if gesture is complete
  if (state.pressed.length === settings.sequence.length) {
    state.progress++;
    document.getElementById("status").innerHTML = "Gesture complete!";
    document.getElementById("progress").innerHTML =
        "Progress: " + state.progress + " / " + settings.needed;
    state.pressed = []; // if everything is correct in the array, the gesture is done, reset for the next swipe
  }
}

//Open door function
function tryOpen() {
  const statusEl = document.getElementById("Status");
  const progressEl = document.getElementById("Progress");

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
