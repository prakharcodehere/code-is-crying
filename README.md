# code-is-crying 😭

> Your terminal failed. It knows. Now everyone will hear it.

**code-is-crying** plays a sound the moment a terminal command exits with an error.
No more silently failing builds. No more missed crashes. Your terminal will cry about it — out loud.

---

## What It Does

- Watches your **terminal** for failed commands (non-zero exit codes)
- Plays a sound the moment something errors out
- Supports **multiple sound files** — plays one at random each time
- Works with any command — `npm`, `tsc`, `python`, `git`, anything

> [!IMPORTANT]
> This extension watches **terminal command failures**, not editor squiggles.
> It triggers when a command exits with a non-zero exit code (e.g. `npm run build` fails, `tsc` throws errors, a script crashes).
> It does **not** trigger on red underlines while you type.

---

## Installation

1. Open VS Code
2. Go to Extensions (`Cmd+Shift+X`)
3. Search for `code-is-crying`
4. Click **Install**

That's it. No setup. No config. It just works.

---

## Add Your Own Sounds

Drop any audio files into the extension's `sounds/` folder:

```
sounds/
  error.mp3
  sad-trombone.mp3
  vine-boom.mp3   ← as many as you want
```

Supports `.mp3`, `.wav`, `.ogg`, `.aiff`. A random one plays each time.

> Grab free sounds from [mixkit.co/free-sound-effects](https://mixkit.co/free-sound-effects/)

---

## Requirements

> [!WARNING]
> **VS Code Shell Integration must be enabled** (it is on by default).
> Without it, the extension cannot detect terminal command failures.
>
> To verify it's on, open a terminal in VS Code and run any command.
> You should see a small `✓` or `✗` icon next to the prompt after it runs.
> If you don't see it, enable it via:
> **Settings → Terminal → Integrated: Shell Integration: Enabled → turn it on**

- VS Code **1.93 or later**
- macOS, Windows, or Linux

---

## Works On

| OS | Status |
|---|---|
| macOS | Works out of the box |
| Windows | Works out of the box |
| Linux | Run `sudo apt install alsa-utils` if no sound plays |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| No sound plays | Make sure at least one audio file is in the `sounds/` folder |
| Sound never triggers | Check that Shell Integration is enabled (see Requirements above) |
| Extension not activating | Make sure you're on VS Code 1.93+ |

---

*Built for developers who need a little emotional damage to stay productive.*
