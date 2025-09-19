#!/usr/bin/env node

// Simple test script to verify the GitHub MCP server
// This script simulates an MCP client sending a request to the server

import { spawn } from 'child_process';
import { createInterface } from 'readline';

// Spawn the server process
const server = spawn('node', ['index.js'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || 'test_token'
  }
});

// Create readline interface for reading from stdin
const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

// Handle server stdout
server.stdout.on('data', (data) => {
  console.log('Server output:', data.toString());
});

// Handle server stderr
server.stderr.on('data', (data) => {
  console.error('Server error:', data.toString());
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Send a simple JSON-RPC request to test the server
const testRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "get_repository_info",
  params: {
    owner: "octocat",
    repo: "Hello-World"
  }
};

console.log('Sending test request to server...');
server.stdin.write(JSON.stringify(testRequest) + '\n');

// Close the server after a short delay
setTimeout(() => {
  server.stdin.end();
  rl.close();
}, 5000);