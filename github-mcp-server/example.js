#!/usr/bin/env node

// Example script demonstrating how to use the GitHub MCP server
// This script shows how to make requests to the server and handle responses

import { spawn } from 'child_process';

// Function to create an MCP client that communicates with our server
function createGitHubMCPClient() {
  // Spawn the server process
  const server = spawn('node', ['index.js'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      GITHUB_PERSONAL_ACCESS_TOKEN: process.env.GITHUB_PERSONAL_ACCESS_TOKEN || 'your_github_token_here'
    }
  });

  // Promise to handle the next response from the server
  let responsePromise = null;
  let responseResolve = null;

  // Handle server stdout
  server.stdout.on('data', (data) => {
    try {
      const response = JSON.parse(data.toString());
      if (responseResolve) {
        responseResolve(response);
        responsePromise = null;
        responseResolve = null;
      }
    } catch (error) {
      console.error('Error parsing server response:', error);
    }
  });

  // Handle server stderr
  server.stderr.on('data', (data) => {
    console.error('Server error:', data.toString());
  });

  // Function to send a request to the server
  function sendRequest(method, params) {
    return new Promise((resolve, reject) => {
      // Set up the response handler
      responsePromise = new Promise((res) => {
        responseResolve = res;
      });

      // Create the request
      const request = {
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params
      };

      // Send the request to the server
      server.stdin.write(JSON.stringify(request) + '\n');

      // Set a timeout for the response
      const timeout = setTimeout(() => {
        reject(new Error('Request timeout'));
      }, 10000);

      // Handle the response
      responsePromise.then((response) => {
        clearTimeout(timeout);
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response.result);
        }
      }).catch(reject);
    });
  }

  // Function to close the server connection
  function close() {
    server.stdin.end();
  }

  return {
    sendRequest,
    close
  };
}

// Example usage
async function example() {
  const client = createGitHubMCPClient();

  try {
    // Example 1: Get repository information
    console.log('Getting repository information...');
    const repoInfo = await client.sendRequest('get_repository_info', {
      owner: 'microsoft',
      repo: 'vscode'
    });
    console.log('Repository info:', repoInfo);

    // Example 2: List user repositories
    console.log('\nListing user repositories...');
    const userRepos = await client.sendRequest('list_user_repositories', {
      username: 'octocat'
    });
    console.log('User repositories:', userRepos);

    // Example 3: Get user information
    console.log('\nGetting user information...');
    const userInfo = await client.sendRequest('get_user_info', {
      username: 'torvalds'
    });
    console.log('User info:', userInfo);
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    // Close the connection
    client.close();
  }
}

// Run the example if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  example();
}

export { createGitHubMCPClient };