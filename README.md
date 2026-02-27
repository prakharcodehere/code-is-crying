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

## Sounds

Comes loaded with multiple meme sounds out of the box. Every time your terminal fails, a random one plays — so you never know what's coming.

Supports `.mp3`, `.wav`, `.ogg`, `.aiff`.

---

## Custom Sounds

You can add your own sounds — straight from VS Code or your terminal.

### Via Command Palette

Open the Command Palette (`Cmd+Shift+P`) and search **"Code is Crying"**:

| Command Palette | Command ID | What it does |
|---|---|---|
| `Code is Crying: Add Custom Sound` | `code-is-crying.addCustomSound` | Opens a file picker — pick any audio file(s) to add to your collection |
| `Code is Crying: Remove Custom Sound` | `code-is-crying.removeSound` | Shows a list of your custom sounds — select one or more to delete |
| `Code is Crying: List Loaded Sounds` | `code-is-crying.listSounds` | See every sound currently in the pool (bundled + custom) |
| `Code is Crying: Install CLI to PATH` | `code-is-crying.installCli` | One-click install of the `code-is-crying` CLI to `/usr/local/bin` |

The first time you add a sound, it gets saved to a folder managed by the extension. You can also point it at any folder you like via settings (see below).

### Via Settings

Point the extension at any folder full of sounds:

```
Settings → search "code-is-crying" → Custom Sounds Directory
```

Or add it directly to your `settings.json`:

```json
{
  "code-is-crying.customSoundsDirectory": "/path/to/your/sounds"
}
```

All files in that folder will be added to the pool alongside the built-in sounds.

---

## Terminal CLI

Want to manage your sounds without leaving the terminal? Install the CLI first:

**Option 1 — from VS Code:**
Open the Command Palette → `Code is Crying: Install CLI to PATH`

**Option 2 — manually:**
```sh
sudo node /path/to/extension/bin/cli.js  # or let the command above handle it
```

Once installed, you get the `code-is-crying` command anywhere:

```sh
# Add one or more sounds
code-is-crying add ./my-sound.mp3
code-is-crying add ~/Downloads/vine-boom.mp3 ~/Downloads/sad-trombone.wav

# Remove a custom sound by filename
code-is-crying remove vine-boom.mp3

# List all your custom sounds
code-is-crying list

# Print the custom sounds folder path
code-is-crying dir

# Help
code-is-crying help
```

The CLI reads your VS Code settings automatically — if you've set a custom sounds directory, it uses that. Otherwise it uses the same default folder the extension manages.

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

- VS Code **1.93 or later** or **Cursor**
- macOS, Windows, or Linux

---

## Works On

| OS | Status |
|---|---|
| macOS | Works out of the box |
| Windows | Works out of the box |
| Linux | Run `sudo apt install alsa-utils` if no sound plays |

| Editor | Status |
|---|---|
| VS Code | ✓ Full support |
| Cursor | ✓ Full support (install from VS Code Marketplace or `.vsix`) |

---

## Troubleshooting

| Problem | Fix |
|---|---|
| No sound plays | Make sure at least one audio file is in the sounds pool (run `code-is-crying list` to check) |
| Sound never triggers | Check that Shell Integration is enabled (see Requirements above) |
| Extension not activating | Make sure you're on VS Code 1.93+ |
| CLI install fails with permission error | The command will offer to re-run with `sudo` automatically |
| Custom sounds not playing | Verify the path in Settings → `code-is-crying.customSoundsDirectory` exists and contains audio files |

---

## Join the club

[![VS Code Installs](https://img.shields.io/visual-studio-marketplace/i/code-is-crying.code-is-crying?label=developers%20who%20can%27t%20code%20in%20silence&color=blueviolet&style=for-the-badge)](https://marketplace.visualstudio.com/items?itemName=code-is-crying.code-is-crying)

---

## If this made you laugh

[![GitHub stars](https://img.shields.io/github/stars/prakharcodehere/code-is-crying?style=for-the-badge&color=yellow)](https://github.com/prakharcodehere/code-is-crying)

Give it a star on GitHub — it won't fix your code but it'll make the extension feel better about itself.

---

## Share the pain

[![Tweet](https://img.shields.io/badge/Tweet%20this-%231DA1F2?style=for-the-badge&logo=twitter&logoColor=white)](https://twitter.com/intent/tweet?text=I%20just%20installed%20an%20extension%20that%20plays%20meme%20sounds%20every%20time%20my%20terminal%20fails%20and%20honestly%20I%20deserve%20it%20%F0%9F%98%AD%20%E2%80%94%20code-is-crying%20for%20%40code%20https%3A%2F%2Fmarketplace.visualstudio.com%2Fitems%3FitemName%3Dcode-is-crying.code-is-crying)

Your teammates need to know about this.

---

*Built for developers who need a little emotional damage to stay productive.*
