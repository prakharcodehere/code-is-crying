#!/usr/bin/env node
// code-is-crying CLI — manage your custom sounds from the terminal
// Usage:
//   code-is-crying add <file> [file2 ...]   — add custom sound(s)
//   code-is-crying remove <name>            — remove a custom sound by filename
//   code-is-crying list                     — list all custom sounds
//   code-is-crying dir                      — print the custom sounds directory

'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// ── Locate VS Code settings & globalStorage ──────────────────────────────────

function vscodeUserDir() {
  switch (process.platform) {
    case 'darwin':
      return path.join(os.homedir(), 'Library', 'Application Support', 'Code', 'User');
    case 'win32':
      return path.join(process.env.APPDATA || os.homedir(), 'Code', 'User');
    default: // linux
      return path.join(os.homedir(), '.config', 'Code', 'User');
  }
}

function readVSCodeSetting(key) {
  try {
    const settings = JSON.parse(
      fs.readFileSync(path.join(vscodeUserDir(), 'settings.json'), 'utf8')
    );
    return settings[key] || '';
  } catch (_) {
    return '';
  }
}

function getCustomSoundsDir() {
  const configured = readVSCodeSetting('code-is-crying.customSoundsDirectory').trim();
  if (configured) return configured;
  // Default: same path the VS Code extension uses
  return path.join(
    vscodeUserDir(),
    'globalStorage',
    'code-is-crying.code-is-crying',
    'custom-sounds'
  );
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function soundFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => /\.(mp3|wav|ogg|aiff)$/i.test(f));
}

// ── Commands ─────────────────────────────────────────────────────────────────

function cmdAdd(files) {
  if (!files.length) return die('Usage: code-is-crying add <file> [file2 ...]');
  const dir = getCustomSoundsDir();
  ensureDir(dir);
  let added = 0;
  for (const f of files) {
    const src = path.resolve(f);
    if (!fs.existsSync(src)) { console.error(`  ✗ not found: ${src}`); continue; }
    if (!/\.(mp3|wav|ogg|aiff)$/i.test(src)) { console.error(`  ✗ unsupported format: ${path.basename(src)}`); continue; }
    const dest = path.join(dir, path.basename(src));
    fs.copyFileSync(src, dest);
    console.log(`  ✓ added ${path.basename(src)}`);
    added++;
  }
  if (added) console.log(`\n${added} sound(s) added to ${dir}`);
}

function cmdRemove(name) {
  if (!name) return die('Usage: code-is-crying remove <filename>');
  const dir  = getCustomSoundsDir();
  const file = path.join(dir, path.basename(name));
  if (!fs.existsSync(file)) return die(`Not found: ${file}`);
  fs.unlinkSync(file);
  console.log(`  ✓ removed ${path.basename(name)}`);
}

function cmdList() {
  const dir   = getCustomSoundsDir();
  const files = soundFiles(dir);
  if (!files.length) {
    console.log('No custom sounds found.');
    console.log(`Directory: ${dir}`);
    return;
  }
  console.log(`Custom sounds in ${dir}:\n`);
  files.forEach(f => console.log(`  • ${f}`));
  console.log(`\nTotal: ${files.length}`);
}

function cmdDir() {
  console.log(getCustomSoundsDir());
}

function help() {
  console.log(`
code-is-crying — manage your custom sounds

Usage:
  code-is-crying add <file> [file2 ...]   Add custom sound file(s)
  code-is-crying remove <filename>        Remove a custom sound
  code-is-crying list                     List all custom sounds
  code-is-crying dir                      Print the custom sounds directory
  code-is-crying help                     Show this message
`);
}

function die(msg) {
  console.error(msg);
  process.exit(1);
}

// ── Entry ────────────────────────────────────────────────────────────────────

const [,, cmd, ...args] = process.argv;

switch (cmd) {
  case 'add':    cmdAdd(args);      break;
  case 'remove': cmdRemove(args[0]); break;
  case 'list':   cmdList();         break;
  case 'dir':    cmdDir();          break;
  case 'help':
  case '--help':
  case '-h':     help();            break;
  default:       help();
}
