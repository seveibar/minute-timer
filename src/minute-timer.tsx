import { showHUD, getPreferenceValues } from "@raycast/api";
import { exec } from "node:child_process";

// Preference to store the timer end time
const TIMER_END_PREF = "timerEnd";

// Command to play a sound (adjust the file path as needed)
const PLAY_SOUND_COMMAND = "afplay /System/Library/Sounds/Glass.aiff";

// Get the current timer end time (if any)
function getTimerEnd(): number {
	const prefs = getPreferenceValues();
	return prefs[TIMER_END_PREF] || 0;
}

// Set the new timer end time
function setTimerEnd(time: number) {
	const prefs = getPreferenceValues();
	prefs[TIMER_END_PREF] = time;
}

// Main function to handle the hotkey press
export default async function Command() {
	const now = Date.now();
	let timerEnd = getTimerEnd();

	if (timerEnd <= now) {
		// If there's no active timer or the previous timer has expired, set a new one
		timerEnd = now + 60000; // 60000 ms = 1 minute
	} else {
		// If there's an active timer, add one minute to it
		timerEnd += 60000;
	}

	setTimerEnd(timerEnd);

	const minutesRemaining = Math.round((timerEnd - now) / 60000);
	await showHUD(`Timer set for ${minutesRemaining} minute(s) from now`);

	// Set a timeout to play the sound when the timer expires
	setTimeout(() => {
		exec(PLAY_SOUND_COMMAND, (error) => {
			if (error) {
				console.error(`Error playing sound: ${error}`);
			}
		});
	}, timerEnd - now);
}
