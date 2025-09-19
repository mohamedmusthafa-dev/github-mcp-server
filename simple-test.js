// Simple test to verify GitHub MCP server functionality
import { spawn } from 'child_process';

console.log('Testing GitHub MCP Server...');

// Spawn the server process
const server = spawn('node', ['index.js'], {
  cwd: process.cwd()
});

let responseReceived = false;

// Handle server stdout
server.stdout.on('data', (data) => {
  console.log('Server response:', data.toString());
  responseReceived = true;
});

// Handle server stderr
server.stderr.on('data', (data) => {
  console.log('Server log:', data.toString());
});

// Handle server exit
server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

// Send a properly formatted JSON-RPC request
setTimeout(() => {
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
  
  // End input after a short delay
  setTimeout(() => {
    server.stdin.end();
  }, 3000);
}, 1000);

// Kill the process after 10 seconds if no response
setTimeout(() => {
  if (!responseReceived) {
    console.log('No response received, terminating test');
    server.kill();
  }
}, 10000);