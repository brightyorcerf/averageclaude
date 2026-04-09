#!/usr/bin/env node
// ABOUTME: CLI entry point — launches the averageclaude Electron app as a detached background process
// ABOUTME: Resolves the bundled electron binary and spawns it with the app directory
const path = require('path');
const { spawn } = require('child_process');

let electronBinary;
try {
  electronBinary = require('electron');
} catch (e) {
  console.error('Could not load Electron. Try: npm install -g averageclaude');
  process.exit(1);
}

const appPath = path.resolve(__dirname, '..');

const child = spawn(electronBinary, [appPath], {
  detached: true,
  stdio: 'ignore',
  windowsHide: true,
});

child.on('error', (err) => {
  console.error('Failed to start averageclaude:', err.message);
  process.exit(1);
});

child.unref();
