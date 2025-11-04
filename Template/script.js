/*
 * Assignment 3: Functional Prototype
 * Hanna Kalvik
 *
 * Programming 2025, Interaction Design Bachelor, Malmö University
 *
 * Structure adapted from template with `state`, `settings`, `update`, `render`, `setup`.
 * Game logic based on interactive balance challenge: vowel/consonant key control.
 */

// Settings
// All constant values that never change during the game
// Object.freeze() prevents accidental changes to these values
const settings = Object.freeze({
  // Define which keys are vowels (tilt left) and consonants (tilt right)
  vowels: ['a', 'e', 'i', 'o', 'u', 'y'],
  consonants: ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'z'],
  
  // Physics settings - control how the game behaves
  tiltSpeed: 0.35,        // How much each key press tilts the beam
  maxTilt: 85,            // Maximum angle the beam can tilt (in degrees)
  ballFriction: 1.0,     // How much the ball slows down each frame (higher = less slowdown)
  beamSmoothness: 0.15,   // How quickly beam moves to target tilt (higher = faster response)
  gravity: 1.2,           // How strongly gravity pulls the ball down the slope
  dangerZone: 150,        // Distance from center where ball turns red (in pixels)
  balanceZone: 10,        // Distance from center where ball turns green (in pixels)
  balanceTime: 3000,      // Time to hold balance to win (in milliseconds = 3 seconds)
  
  // Position settings
  ballStartX: 250,        // Ball starting X position (left of center)
  ballStartY: 250,        // Ball starting Y position (above beam)
  ballRadius: 20,         // Size of the ball
  centerX: 400,           // Center X position of the game area
  beamLeftEdge: 200,      // Left edge of beam (where ball falls off)
  beamRightEdge: 600,     // Right edge of beam (where ball falls off)
  
  // Timing
  updateInterval: 10,     // How often to update game logic (in milliseconds)
  
  // DOM Elements - reference to HTML elements
  ball: document.getElementById('ball'),
  beam: document.getElementById('beam'),
  scoreDisplay: document.getElementById('score'),
  gameOverScreen: document.getElementById('gameOver'),
  finalScoreDisplay: document.getElementById('finalScore'),
  restartButton: document.getElementById('restartBtn'),
  leftIndicator: document.getElementById('leftIndicator'),
  rightIndicator: document.getElementById('rightIndicator'),
});

// All values that change during gameplay
// Object.freeze() ensures we use updateState() to modify state (immutable pattern)
let state = Object.freeze({
  ball: {
    x: settings.ballStartX,     // Current X position of ball
    y: settings.ballStartY,     // Current Y position of ball
    velocityX: 0,               // Speed ball is moving horizontally
    velocityY: 0,               // Speed ball is moving vertically (when falling)
    isFalling: false,           // Is the ball currently falling off the beam?
  },
  beam: {
    tilt: 0,                    // Current angle of beam
    targetTilt: 0,              // Angle beam wants to reach (based on key presses)
  },
  keysPressed: new Set(),       // Set of currently pressed keys (Set prevents duplicates)
  score: 0,                     // Current score in seconds
  startTime: performance.now(), // When the game started (for calculating score)
  isWon: false,                 // Has player won by balancing?
  balanceStartTime: null,       // When ball entered balance zone (null if not balanced)
  highScore: 0,                 // Best score ever achieved
});
 
// Updates state without changing the old one directly
// Freeze it to keep everything stable
function updateState(newState) {
  state = Object.freeze({ ...state, ...newState });
}

// Scales a value between 0-1 (used for the balance process)
function scale(num, min, max) {
  if (num < min) return 0;      // Below minimum = 0%
  if (num > max) return 1;      // Above maximum = 100%
  return (num - min) / (max - min); // Calculate percentage in between
}
 
// Main update function - runs game logic often (100 times per second)
function update() {
  // Don't update if player has won
  if (state.isWon) return;

  // Pull out some values from the state
  let { ball, beam, keysPressed, balanceStartTime } = state;
 
  // Count how many vowels and consonants are currently pressed
  let vowelPressure = 0;
  let consonantPressure = 0;

  // Loop through all pressed keys
  keysPressed.forEach((key) => {
    if (settings.vowels.includes(key)) vowelPressure++;
    if (settings.consonants.includes(key)) consonantPressure++;
  });

  // Update visual indicators
  // Show when vowels are pressed (left indicator)
  settings.leftIndicator.style.opacity = vowelPressure > 0 ? '1' : '0.5';
  settings.leftIndicator.style.transform = vowelPressure > 0 ? 'scale(1.2)' : 'scale(1)';
  settings.leftIndicator.style.color = vowelPressure > 0 ? '#fbbf24' : 'white';

  // Show when consonants are pressed (right indicator)
  settings.rightIndicator.style.opacity = consonantPressure > 0 ? '1' : '0.5';
  settings.rightIndicator.style.transform = consonantPressure > 0 ? 'scale(1.2)' : 'scale(1)';
  settings.rightIndicator.style.color = consonantPressure > 0 ? '#fbbf24' : 'white';

  // Beam tilt 
  // Pressure = difference between consonants (right) and vowels (left)
  // Positive = tilt right, Negative = tilt left
  const pressure = consonantPressure - vowelPressure;
  
  // Calculate target tilt and clamp to max values
  beam.targetTilt = Math.max(
    -settings.maxTilt, 
    Math.min(settings.maxTilt, pressure * settings.tiltSpeed * 10)
  );
  
  // Smoothly move current tilt towards target (creates smooth animation)
  beam.tilt += (beam.targetTilt - beam.tilt) * settings.beamSmoothness;

  // Physics of the ball so the ball moves when the beam tilts
  const tiltRadians = (beam.tilt * Math.PI) / 180;
  
  // Math.sin calculates how much gravity pulls ball sideways based on angle
  ball.velocityX += Math.sin(tiltRadians) * settings.gravity;
  
  // Apply friction to slow ball down slightly each frame
  ball.velocityX *= settings.ballFriction;
  
  // Update ball position based on velocity
  ball.x += ball.velocityX;

  // Handle falling ball
  if (ball.isFalling) {
    // Ball is falling down - apply downward gravity
    ball.velocityY += 0.5;
    ball.y += ball.velocityY;
    
    // If ball is off screen, reset game after short delay
    if (ball.y > 600) setTimeout(resetGame, 200);
  }

  // Checks ball position
  // Calculate how far ball is from center
  const distanceFromCenter = Math.abs(ball.x - settings.centerX);
  const isDanger = distanceFromCenter > settings.dangerZone;   // Far from center?
  const isBalanced = distanceFromCenter < settings.balanceZone; // Very close to center?

  // Handle balancing (green zone)
  if (isBalanced) {
    // Ball is in balance zone!
    
    // Start timer if not already started
    if (balanceStartTime === null) balanceStartTime = performance.now();
    
    // Calculate how long ball has been balanced
    const balanceTime = performance.now() - balanceStartTime;
    
    // Convert to percentage (0-100)
    const progress = Math.round(scale(balanceTime, 0, settings.balanceTime) * 100);

    // Checks if balanced long enough to win
    if (balanceTime >= settings.balanceTime) {
      settings.scoreDisplay.textContent = 'Balancing... 100%';
      winGame();
    } else {
      // Show green ball and progress
      settings.ball.style.backgroundColor = '#10b981'; // Green
      settings.ball.style.boxShadow = '0 0 20px #10b981'; // Green glow
      settings.scoreDisplay.textContent = `Balancing... ${progress}%`;
    }
  } 
  // Handle normal/danger zones
  else {
    // Ball is NOT balanced - fell of the beam, reset timer
    balanceStartTime = null;
    
    if (isDanger) {
      // Ball is in danger zone (far from center)
      settings.ball.style.backgroundColor = '#ef4444'; // Red
      settings.ball.style.boxShadow = '0 0 20px #ef4444'; // Red glow
    } else {
      // Ball is in normal zone
      settings.ball.style.backgroundColor = '#3b82f6'; // Blue
      settings.ball.style.boxShadow = 'none';
    }
    
    // Update score (time survived in seconds)
    const score = Math.floor((performance.now() - state.startTime) / 1000);
    settings.scoreDisplay.textContent = `Score: ${score}s`;
  }

  // Checks if the ball rolled of the beam
  if (!ball.isFalling && (ball.x < settings.beamLeftEdge || ball.x > settings.beamRightEdge)) {
    ball.isFalling = true;
  }

  // Save updated state
  // Update state with new ball and beam values
  updateState({ ball, beam, balanceStartTime });
  
  // Schedule next update
  window.requestAnimationFrame(update);
}

// Updates how everything looks on screen (60 times/sec)
function render() {
  const { ball, beam } = state;
  
  // Update ball position on screen (subtract radius to center it)
  settings.ball.style.left = ball.x - settings.ballRadius + 'px';
  settings.ball.style.top = ball.y - settings.ballRadius + 'px';
  
  // Update beam rotation
  settings.beam.style.transform = `rotate(${beam.tilt}deg)`;
  
  // Request next animation frame (creates smooth 60fps animation)
  window.requestAnimationFrame(render);
}

// Game control
// Function called when player wins (balanced for 3 seconds)
function winGame() {
  // Mark game as won
  updateState({ isWon: true });
  
  // Calculate final score
  const score = Math.floor((performance.now() - state.startTime) / 1000);
  
  // Display win message
  settings.finalScoreDisplay.textContent = `You Made It! Time: ${score}s`;
  
  // Show game over (You Win!) screen
  settings.gameOverScreen.style.display = 'flex';
}

// Function to reset game to starting state
function resetGame() {
  // Reset all state values to initial state
  updateState({
    ball: { 
      x: settings.ballStartX, 
      y: settings.ballStartY, 
      velocityX: 0, 
      velocityY: 0, 
      isFalling: false 
    },
    beam: { 
      tilt: 0, 
      targetTilt: 0 
    },
    keysPressed: new Set(),           // Clear all pressed keys
    score: 0,
    startTime: performance.now(),     // Reset start time
    isWon: false,
    balanceStartTime: null,
  });

  // Reset visual elements
  settings.ball.style.backgroundColor = '#3b82f6'; // Blue
  settings.ball.style.boxShadow = 'none';
  settings.beam.style.transform = 'rotate(0deg)';
  settings.scoreDisplay.textContent = 'Score: 0s';
  settings.gameOverScreen.style.display = 'none'; // Hide game over screen
}

// INPUT 
// Event handler when key is pressed down
function onKeyDown(e) {
  const key = e.key.toLowerCase(); // Convert to lowercase for consistency

  //Spacebar: quick brake - slows ball down by cutting speed in half
  if (key === ' ' && !state.isWon) {
   state.ball.velocityX *= 0.5 // Cut speed 50%
   return; // Don't add spacebar to regular keys
  }
  
  // Only add key if game is not won
  if (!state.isWon) state.keysPressed.add(key);
}

// Event handler when key is released
function onKeyUp(e) {
  const key = e.key.toLowerCase(); // Convert to lowercase for consistency
  
  // Remove key from pressed keys
  state.keysPressed.delete(key);
}

// SETUP 
// Setup function - runs once when page loads
function setup() {
  // Add event listeners for keyboard input
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  
  // Add event listener for restart button
  settings.restartButton.addEventListener('click', resetGame);

  // Initialize game
  resetGame();  // Set initial state
  update();     // Start game logic loop
  render();        // Start render loop
}

// Start everything when page loads
setup();