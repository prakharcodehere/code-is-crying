import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import player from 'play-sound';

const audio = player({});

function getSoundFiles(soundsDir: string): string[] {
  if (!fs.existsSync(soundsDir)) return [];
  return fs
    .readdirSync(soundsDir)
    .filter((f) => /\.(mp3|wav|ogg|aiff)$/i.test(f))
    .map((f) => path.join(soundsDir, f));
}

function getAllSoundFiles(context: vscode.ExtensionContext): string[] {
  const bundled = getSoundFiles(path.join(context.extensionPath, 'sounds'));
  const customDir = vscode.workspace
    .getConfiguration('code-is-crying')
    .get<string>('customSoundsDirectory', '')
    .trim();
  const custom = customDir ? getSoundFiles(customDir) : [];
  return [...bundled, ...custom];
}

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function playSound(context: vscode.ExtensionContext) {
  const sounds = getAllSoundFiles(context);
  const soundPath = pickRandom(sounds);
  if (soundPath) {
    audio.play(soundPath, (err: Error) => {
      if (err) console.error('Could not play sound:', err);
    });
  }
}

// Resolves the custom sounds directory, creating it if needed.
// Falls back to a directory inside globalStorageUri if no custom path is set.
function resolveCustomSoundsDir(context: vscode.ExtensionContext): string {
  const configured = vscode.workspace
    .getConfiguration('code-is-crying')
    .get<string>('customSoundsDirectory', '')
    .trim();

  if (configured) return configured;

  // Default: <globalStorageUri>/custom-sounds/
  const defaultDir = path.join(context.globalStorageUri.fsPath, 'custom-sounds');
  if (!fs.existsSync(defaultDir)) fs.mkdirSync(defaultDir, { recursive: true });
  return defaultDir;
}

export function activate(context: vscode.ExtensionContext) {
  // ── Terminal failure listener ──────────────────────────────────────────────
  const disposable = vscode.window.onDidEndTerminalShellExecution((event) => {
    if (event.exitCode !== undefined && event.exitCode !== 0) {
      playSound(context);
    }
  });
  context.subscriptions.push(disposable);

  const soundCount = getAllSoundFiles(context).length;
  vscode.window.showInformationMessage(
    `code-is-crying is listening to your terminal 👀 (${soundCount} sound${soundCount !== 1 ? 's' : ''} loaded)`
  );

  // ── Command: Add Custom Sound ──────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('code-is-crying.addCustomSound', async () => {
      const uris = await vscode.window.showOpenDialog({
        canSelectMany: true,
        filters: { 'Audio files': ['mp3', 'wav', 'ogg', 'aiff'] },
        openLabel: 'Add Sound',
        title: 'Pick audio files to add',
      });

      if (!uris || uris.length === 0) return;

      const destDir = resolveCustomSoundsDir(context);

      let copied = 0;
      for (const uri of uris) {
        const dest = path.join(destDir, path.basename(uri.fsPath));
        fs.copyFileSync(uri.fsPath, dest);
        copied++;
      }

      // If the user hasn't configured a custom directory, point them at the default one
      const configured = vscode.workspace
        .getConfiguration('code-is-crying')
        .get<string>('customSoundsDirectory', '')
        .trim();

      if (!configured) {
        const action = await vscode.window.showInformationMessage(
          `Added ${copied} sound${copied !== 1 ? 's' : ''} to: ${destDir}`,
          'Set as Custom Sounds Directory'
        );
        if (action) {
          await vscode.workspace
            .getConfiguration('code-is-crying')
            .update('customSoundsDirectory', destDir, vscode.ConfigurationTarget.Global);
        }
      } else {
        vscode.window.showInformationMessage(
          `Added ${copied} sound${copied !== 1 ? 's' : ''} to your custom sounds folder.`
        );
      }
    })
  );

  // ── Command: Remove Custom Sound ──────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('code-is-crying.removeSound', async () => {
      const customDir = resolveCustomSoundsDir(context);
      const customSounds = getSoundFiles(customDir);

      if (customSounds.length === 0) {
        vscode.window.showInformationMessage(
          'No custom sounds found. Add some first with "Code is Crying: Add Custom Sound".'
        );
        return;
      }

      const items = customSounds.map((p) => ({
        label: path.basename(p),
        description: p,
      }));

      const selected = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a custom sound to remove',
        title: 'Remove Custom Sound',
        canPickMany: true,
      });

      if (!selected || selected.length === 0) return;

      for (const item of selected) {
        fs.unlinkSync(item.description!);
      }

      vscode.window.showInformationMessage(
        `Removed ${selected.length} sound${selected.length !== 1 ? 's' : ''}.`
      );
    })
  );

  // ── Command: List Sounds ───────────────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('code-is-crying.listSounds', () => {
      const all = getAllSoundFiles(context);
      if (all.length === 0) {
        vscode.window.showInformationMessage('No sounds loaded.');
        return;
      }
      vscode.window.showQuickPick(
        all.map((p) => ({ label: path.basename(p), description: p })),
        { title: `Loaded Sounds (${all.length})`, placeHolder: 'These sounds may play on errors' }
      );
    })
  );

  // ── Command: Install CLI to PATH ───────────────────────────────────────────
  context.subscriptions.push(
    vscode.commands.registerCommand('code-is-crying.installCli', async () => {
      const cliSrc = path.join(context.extensionPath, 'bin', 'cli.js');
      const installPath = '/usr/local/bin/code-is-crying';

      if (!fs.existsSync(cliSrc)) {
        vscode.window.showErrorMessage('CLI script not found in extension bundle.');
        return;
      }

      // Write a small shell wrapper so users don't need to reference the full path
      const wrapper = `#!/bin/sh\nexec node "${cliSrc}" "$@"\n`;

      try {
        fs.writeFileSync(installPath, wrapper, { mode: 0o755 });
        const action = await vscode.window.showInformationMessage(
          `CLI installed! Run "code-is-crying help" in any terminal.`,
          'Open Terminal'
        );
        if (action) {
          const terminal = vscode.window.createTerminal('code-is-crying');
          terminal.show();
          terminal.sendText('code-is-crying help');
        }
      } catch (err: any) {
        if (err.code === 'EACCES' || err.code === 'EPERM') {
          // Offer to run with sudo via a new terminal
          const action = await vscode.window.showErrorMessage(
            `Permission denied writing to ${installPath}. Run with sudo?`,
            'Run with sudo'
          );
          if (action) {
            const terminal = vscode.window.createTerminal('code-is-crying install');
            terminal.show();
            terminal.sendText(
              `echo '#!/bin/sh\\nexec node "${cliSrc}" "\\$@"' | sudo tee ${installPath} > /dev/null && sudo chmod +x ${installPath} && echo "✓ Installed! Try: code-is-crying help"`
            );
          }
        } else {
          vscode.window.showErrorMessage(`Install failed: ${err.message}`);
        }
      }
    })
  );
}

export function deactivate() {}
