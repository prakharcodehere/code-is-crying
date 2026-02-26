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

function pickRandom<T>(arr: T[]): T | undefined {
  if (arr.length === 0) return undefined;
  return arr[Math.floor(Math.random() * arr.length)];
}

function playSound(soundsDir: string) {
  const sounds = getSoundFiles(soundsDir);
  const soundPath = pickRandom(sounds);
  if (soundPath) {
    audio.play(soundPath, (err: Error) => {
      if (err) console.error('Could not play sound:', err);
    });
  }
}

export function activate(context: vscode.ExtensionContext) {
  const soundsDir = path.join(context.extensionPath, 'sounds');

  // fires when a terminal command finishes — check exit code
  const disposable = vscode.window.onDidEndTerminalShellExecution((event) => {
    // exit code 0 = success, anything else = error
    if (event.exitCode !== undefined && event.exitCode !== 0) {
      playSound(soundsDir);
    }
  });

  context.subscriptions.push(disposable);

  const soundCount = getSoundFiles(soundsDir).length;
  vscode.window.showInformationMessage(
    `code-is-crying is listening to your terminal 👀 (${soundCount} sound${soundCount !== 1 ? 's' : ''} loaded)`
  );
}

export function deactivate() {}
