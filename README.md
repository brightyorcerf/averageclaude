![divider](assets/divider.png)

# 🎲 averageclaude

A 50/50 gamble for encouragement or discipline for Claude Code! 

Roll the dice to see what vibe Claude gets today. Is it the magical compliment wand? Or the strict red disciplinary whip? 

---

## 🚀 How to Run

Now that we are officially published on the NPM registry, anyone in the world can install and run this application using a single command without needing to clone or download the code manually!

```bash
# Globally install the public package on your machine
npm install -g averageclaude

# Run the app from anywhere!
averageclaude
```

Once running, **nothing will appear to happen**. This is normal! 

1. Look at your **macOS Menu Bar** (top right of your screen).
2. Click the `averageclaude` tray icon to spawn the silent overlay.
3. Wave your mouse aggressively back and forth, or click to trigger your 50/50 vibe sequence!

---

## 📊 The Hustle Dashboard (Performance Review)

People love stats. This app gamifies your workflow by keeping a "score" of your psychological interactions with Claude.

To access your stats:
1. Right-click the `averageclaude` icon in your tray.
2. Select **Performance Review**.

An aesthetic glassmorphism window will appear containing your live stats:
* **Total Blessings:** How many times you complimented the AI.
* **Total Disciplines:** How many times you cracked the whip.
* **Relationship Status:** A dynamic judgment of your current alignment (e.g. "Toxic", "Besties", "Professional", "Angelic", etc.).

---

## ⚙️ Custom Settings

Want to modify the physics, speed limits, or the text? It's easily customizable if you clone the repo locally! 

* **The Strings:** Open `main.js` and edit the `messages` object to change exactly what gets typed.
* **The Physics:** Open `overlay.html` and edit the `P` object. You can modify wand length, whip constraint gravity, tracking speeds, wave thresholds, and more!

---

## 🛠️ Debugging

**"Nothing types when the wand/whip triggers!"**
macOS is blocking the automated keystrokes for your security. 
* **The Fix:** Go to **System Settings > Privacy & Security > Accessibility** and toggle exactly the terminal app you are running this from (e.g. `Terminal`, `iTerm`, `Cursor`) to **ON**.

**"Terminal says `electron: command not found`!"**
Your node environment interrupted the electron binary download during install. 
* **The Fix:** Run a clean install: `rm -rf node_modules package-lock.json && npm install && npm start`.

---

## 📖 The "Development Chronicle"

Publishing this app wasn't without its obstacles! Here is a brief history of our bugs, battles, and victories combining GoodClaude and BadClaude:
1. **The Architecture Flattening:** Initially nested in `averageclaude/averageclaude/`, the local NPM linking completely broke when we flattened out the repos because our `.bin/averageclaude.js` executable got lost in transit.
2. **The Missing Electron Payload (`sh: electron: command not found`)**: At one point, running `npm install` gracefully pulled down the 71 standard node dependencies but silently skipped downloading the massive OS-specific Electron binary! We had to hard-route the `package.json` to trigger the `postinstall` hook manually.
3. **Double Escaping AppleScript Bug (`Syntax Error -2741`)**: When merging the keystroke logic, joining the `osascript` lines with a literal string `\\n` instead of an actual newline `\n` completely broke the macro typing!
4. **macOS Gatekeeping (`Error 1002`)**: macOS natively hates rogue apps sending ghost keystrokes, forcing us to explicitly document the Accessibility permission block.
5. **The `EACCES` Trap**: A classic developer struggle. Trying to globally install to `/usr/local/lib/node_modules/` threw repeated permission errors until we forcefully used `sudo npm install -g .` to override the ghost of `root`.
6. **The WebAuthn Security Block (`403 Forbidden`)**: During the final `npm publish` run, the terminal blocked us from pushing to the registry solely because Two-Factor Authentication via an active hardware Security Key was enabled. We successfully bypassed it by generating a Granular Access Token with 2FA bypass permissions directly from NPM!