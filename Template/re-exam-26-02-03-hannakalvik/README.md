SILENT ESCAPE GAME

Description:
A simple keyboard-based game where the player must press the correct keys in the correct order to be able to escape.

Rules:
- The player must press the keys in the exact order shown in the sequence.
- Only one key is checked at a time, starting from the beginning of the sequence.
- Each correct key press moves the player one step forward in the sequence.
- If the player presses an incorrect key, the current input is cleared and the player must start again from the beginning.
- The player cannot skip keys or press keys out of order.
- The sequence must be completed without mistakes to increase progress.

Goal:
- The main goal of the game is to unlock the door and escape.
- To unlock the door, the player must correctly complete the full key sequence.
- Each correct sequence brings the player closer to escaping by increasing progress.
- The player must focus on accuracy and order, as any mistake resets the current attempt.
- Successfully completing the sequence represents cracking the lock.

How the game works:
- Key presses are captures using a keyboard event listener.
- Pessed keys are stored in an array (state.pressed).
- Each new key press is compared to the expected key in the sequence.
- If the input does not match, the game resets the pressed keys.
- When the full sequence is completet correctly, the progress counter increases. 