#!/usr/bin/env node

// Setup script to help users configure the GitHub MCP server

import { createInterface } from 'readline';
import { writeFileSync, existsSync, readFileSync } from 'fs';

const rl = createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('GitHub MCP Server Setup');
console.log('========================');
console.log('');

// Check if .env file already exists
if (existsSync('.env')) {
  console.log('A .env file already exists. Skipping setup.');
  console.log('If you want to reconfigure, delete the .env file and run this script again.');
 process.exit(0);
}

console.log('This script will help you set up the GitHub MCP server.');
console.log('You will need a GitHub Personal Access Token.');
console.log('');

rl.question('Do you have a GitHub Personal Access Token? (y/n): ', (answer) => {
  if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
    console.log('');
    console.log('To create a GitHub Personal Access Token:');
    console.log('1. Go to https://github.com/settings/tokens');
    console.log('2. Click "Generate new token"');
    console.log('3. Select the appropriate scopes (repo, read:user, etc.)');
    console.log('4. Click "Generate token"');
    console.log('5. Copy the token and paste it below');
    console.log('');
  }

  rl.question('Enter your GitHub Personal Access Token: ', (token) => {
    if (!token || token.trim() === '') {
      console.log('Token is required. Setup aborted.');
      rl.close();
      return;
    }

    // Create .env file
    const envContent = `# GitHub Personal Access Token\nGITHUB_PERSONAL_ACCESS_TOKEN=${token.trim()}\n`;
    writeFileSync('.env', envContent);

    console.log('');
    console.log('Setup complete!');
    console.log('Your .env file has been created with your GitHub token.');
    console.log('');
    console.log('To start the server, run:');
    console.log('  npm start');
    console.log('');
    console.log('To test the server, run:');
    console.log('  npm test');
    console.log('');

    rl.close();
  });
});
