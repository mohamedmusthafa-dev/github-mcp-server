// Quick test script to verify the GitHub MCP server works with the provided token
import { spawn } from 'child_process';

// Spawn the server process
const server = spawn('node', ['index.js'], {
  cwd: process.cwd()
});

let output = '';
let errorOutput = '';

// Capture stdout
server.stdout.on('data', (data) => {
  output += data.toString();
});

// Capture stderr
server.stderr.on('data', (data) => {
  errorOutput += data.toString();
});

// Handle server exit
server.on('close', (code) => {
  console.log('Server started with output:', output);
  if (errorOutput) {
    console.log('Server errors:', errorOutput);
  }
  console.log(`Server process exited with code ${code}`);
});

// Send a simple request after a short delay
setTimeout(() => {
  // Simple JSON-RPC request to get repository info
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "get_repository_info",
    params: {
      owner: "octocat",
      repo: "Hello-World"
    }
  };
  
  console.log('Sending request:', JSON.stringify(request));
  server.stdin.write(JSON.stringify(request) + '\n');
  
  // Give it a moment to process
  setTimeout(() => {
    server.stdin.end();
  }, 2000);
}, 1000);