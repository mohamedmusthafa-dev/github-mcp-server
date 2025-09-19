#!/usr/bin/env node

// Script to run the list_repository_issues tool on your GitHub MCP server
import { spawn } from 'child_process';

console.log('Running list_repository_issues tool on GitHub MCP Server...\n');

// Spawn the server process
const server = spawn('node', ['index.js'], {
  cwd: process.cwd()
});

let responseReceived = false;

// Handle server stdout
server.stdout.on('data', (data) => {
  try {
    const response = JSON.parse(data.toString());
    console.log('Tool response:');
    console.log(JSON.stringify(response, null, 2));
    responseReceived = true;
  } catch (error) {
    console.log('Server output:', data.toString());
  }
});

// Handle server stderr
server.stderr.on('data', (data) => {
  console.log('Server log:', data.toString());
});

// Handle server exit
server.on('close', (code) => {
  console.log(`\nServer process exited with code ${code}`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Failed to start server:', error);
});

// Send a properly formatted JSON-RPC request for list_repository_issues
setTimeout(() => {
  const request = {
    jsonrpc: "2.0",
    id: 1,
    method: "list_repository_issues",
    params: {
      owner: "facebook",
      repo: "react",
      state: "open"  // Can be "open", "closed", or "all"
    }
  };
  
  console.log('Sending request to list open issues in facebook/react repository:');
  console.log(JSON.stringify(request, null, 2));
  console.log('\n---');
  
  server.stdin.write(JSON.stringify(request) + '\n');
  
  // End input after a short delay
  setTimeout(() => {
    server.stdin.end();
  }, 3000);
}, 1000);

// Kill the process after 15 seconds if no response
setTimeout(() => {
  if (!responseReceived) {
    console.log('No response received, terminating test');
    server.kill();
  }
}, 15000);