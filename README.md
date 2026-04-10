# averageclaude

> A 50/50 gamble for encouragement or discipline for Claude Code! 

Roll the dice to see what vibe you get today. Is it the magical compliment wand? Or the strict disciplinary whip? 

![img.png](img.png)

---

## How to Run

Now that we are officially published on the NPM registry, anyone in the world can install and run this application using a single command without needing to clone or download the code manually!

```bash
# Globally install the public package on your machine
npm install -g averageclaude

# Run the app from anywhere!
averageclaude
```

Once running, the application will silently load into your system tray.

### Triggering the Gamble
You have three ways to bring up the 50/50 overlay:
1. Click the `averageclaude` application icon in your macOS **Dock**.
2. Click the `averageclaude` tray icon in your top right menu bar and select **"Gamble (Toggle Overlay)"**.
3. Once the invisible overlay is active, you will see a large `>_ GAMBLE` floating action button (FAB). Click it (or wave your mouse aggressively back and forth) to trigger your 50/50 vibe sequence!

*(The animation will now automatically clean itself up and fade away 2.5 seconds after firing, sending you instantly back to your workflow!)*

---

## Hustle Dashboard

People love stats. This app gamifies your workflow by keeping a "score" of your psychological interactions with Claude, fully styled in a minimalist, distraction-free monochrome aesthetic.

To access your stats:
1. Click the `averageclaude` icon in your tray.
2. Select **hustle dashboard**.

A window will appear containing your live stats:
* **Total Blessings:** How many times you complimented the AI.
* **Total Disciplines:** How many times you cracked the whip.
* **Relationship Status:** A dynamic judgment of your current alignment (e.g. "Toxic", "Besties", "Professional", "Angelic", etc.).

---

## Custom Settings

Want to modify the physics, speed limits, or the text? It's easily customizable if you clone the repo locally! 

* **The Strings:** Open `main.js` and edit the `messages` object to change exactly what gets typed.
* **The Physics:** Open `overlay.html` and edit the `P` object. You can modify wand length, whip constraint gravity, tracking speeds, wave thresholds, and more!

---

## Debugging

"Nothing types when the wand/whip triggers!"
macOS is blocking the automated keystrokes for your security. 
* The Fix: Go to System Settings > Privacy & Security > Accessibility and toggle exactly the terminal app you are running this from (e.g. `Terminal`, `iTerm`, `Cursor`) to ON.

"Terminal says `electron: command not found`!"
Your node environment interrupted the electron binary download during install. 
* The Fix: Run a clean install: `rm -rf node_modules package-lock.json && npm install && npm start`.

---

## The "Development Chronicle"

Publishing this app wasn't without its obstacles! Here is a brief history of our bugs, battles, and victories combining GoodClaude and BadClaude:
1. **The Architecture Flattening:** Initially nested in `averageclaude/averageclaude/`, the local NPM linking completely broke when we flattened out the repos because our `.bin/averageclaude.js` executable got lost in transit.
2. **The Missing Electron Payload (`sh: electron: command not found`)**: At one point, running `npm install` gracefully pulled down the 71 standard node dependencies but silently skipped downloading the massive OS-specific Electron binary! We had to hard-route the `package.json` to trigger the `postinstall` hook manually.
3. **Double Escaping AppleScript Bug (`Syntax Error -2741`)**: When merging the keystroke logic, joining the `osascript` lines with a literal string `\\n` instead of an actual newline `\n` completely broke the macro typing!
4. **macOS Gatekeeping (`Error 1002`)**: macOS natively hates rogue apps sending ghost keystrokes, forcing us to explicitly document the Accessibility permission block.
5. **The `EACCES` Trap**: A classic developer struggle. Trying to globally install to `/usr/local/lib/node_modules/` threw repeated permission errors until we forcefully used `sudo npm install -g .` to override the ghost of `root`.
6. **The WebAuthn Security Block (`403 Forbidden`)**: During the final `npm publish` run, the terminal blocked us from pushing to the registry solely because Two-Factor Authentication via an active hardware Security Key was enabled. We successfully bypassed it by generating a Granular Access Token with 2FA bypass permissions directly from NPM!

---

## What's New in v1.1.0

Enhanced UI & Global Visibility
This update introduces a terminal-style Floating Action Button (FAB) that replaces the legacy 4-pixel cursor, providing a high-visibility interaction point optimized for Retina displays. To ensure a persistent "Anti-Yap" experience, the overlay now utilizes aggressive visibility logic, leveraging `type: 'panel'` native constraints and `setVisibleOnAllWorkspaces` priority. This prevents macOS from force-switching desktop spaces and keeps the canvas pinned directly above full-screen terminal sessions, ensuring the "Judgment" is always front and center regardless of your workflow.

Optimized Performance & Seamless Interaction
Under the hood, we’ve decoupled gesture tracking from the main rendering loop using passive listeners, eliminating DOM lag and preventing crash loops during high-speed operations. The audio engine has been rebuilt to natively pre-load assets into memory, delivering a lag-free sound experience through node cloning. Most importantly, the new "Click-Through" bridge dynamically toggles native OS mouse hooks; as soon as an animation triggers, the overlay immediately becomes fully transparent to user input. This allows you to smoothly continue terminal work completely uninterrupted while the magical visual effects and macros play out automatically around your active code.