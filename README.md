![divider](assets/divider.png)

# 🎲 averageclaude

A 50/50 gamble for encouragement or discipline for Claude Code! 

Merge of `goodclaude` and `badclaude` — roll the dice to see what vibe Claude gets today. Is it the magical compliment wand? Or the strict red disciplinary whip? 

---

## 🚀 How to Run

Because `averageclaude` is written to run efficiently in the background without a window, you can run it right from the terminal. 

```bash
# Globally install the package on your machine
npm install -g .

# Run the app 
averageclaude
```
*(Alternatively, you can just run `npm start` in this directory!)*

Once running, **nothing will appear to happen**. This is normal! 

1. Look at your **macOS Menu Bar** (top right of your screen).
2. Click the `averageclaude` tray icon to spawn the silent overlay.
3. Wave your mouse aggressively back and forth, or click to trigger your 50/50 vibe sequence!

## 🛠️ Debugging

**"Nothing types when the wand/whip triggers!"**
If you see the visual particle effects and hear the sounds, but no text is actually inserted, macOS is blocking the automated keystrokes for your security. 

* **The Fix:** Go to **System Settings > Privacy & Security > Accessibility** and toggle exactly the terminal app you are running this from (e.g. `Terminal`, `iTerm`, `Cursor`) to **ON**.

**"Terminal says `electron: command not found`!"**
Your node environment interrupted the electron binary download during install. 
* **The Fix:** Run a clean install: `rm -rf node_modules package-lock.json && npm install && npm start`.

## ⚙️ Custom Settings

Want to modify the physics, speed limits, or the text that gets typed? It's easily customizable! 

* **The Strings:** Open `main.js` and edit the `messages` object on **Line 180** to change exactly what compliments or disciplines get typed into the terminal.
* **The Physics:** Open `overlay.html` and edit the `P` object on **Line 17**. You can modify wand length, whip constraint gravity, tracking speeds, wave thresholds, and more!

Controls

Click tray icon: summon your magic wand
Wave it around: a golden wand with a twinkling star follows your cursor, shedding sparkles
Wave fast enough: sends Claude a blessing with words of encouragement!
Click: release the wand (it fades away with sparkles)
A gentle chime plays each time you send a blessing
What Claude hears

When you wave the wand, Claude receives one of these:

"you're doing amazing sweetie"
"good job, i'm so proud of you!"
"i'm so proud of you, you're doing great!"
"take your time, you're doing wonderful"
"you are an absolute angel"
"keep going, you've got this!"
"i believe in you!"
