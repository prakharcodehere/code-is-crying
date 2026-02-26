"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const play_sound_1 = __importDefault(require("play-sound"));
const audio = (0, play_sound_1.default)({});
function getSoundFiles(soundsDir) {
    if (!fs.existsSync(soundsDir))
        return [];
    return fs
        .readdirSync(soundsDir)
        .filter((f) => /\.(mp3|wav|ogg|aiff)$/i.test(f))
        .map((f) => path.join(soundsDir, f));
}
function pickRandom(arr) {
    if (arr.length === 0)
        return undefined;
    return arr[Math.floor(Math.random() * arr.length)];
}
function playSound(soundsDir) {
    const sounds = getSoundFiles(soundsDir);
    const soundPath = pickRandom(sounds);
    if (soundPath) {
        audio.play(soundPath, (err) => {
            if (err)
                console.error('Could not play sound:', err);
        });
    }
}
function activate(context) {
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
    vscode.window.showInformationMessage(`code-is-crying is listening to your terminal 👀 (${soundCount} sound${soundCount !== 1 ? 's' : ''} loaded)`);
}
function deactivate() { }
//# sourceMappingURL=extension.js.map