# Using the GitHub MCP Server with Kilo Code

This document explains how to use the GitHub MCP server with the Kilo Code system.

## Prerequisites

1. Node.js (version 14 or higher)
2. A GitHub account
3. A GitHub Personal Access Token

## Installation

1. Navigate to the server directory:
   ```bash
   cd C:\Users\MDM PC\AppData\Roaming\Kilo-Code\MCP\github-mcp-server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

You can configure the server in two ways:

### Method 1: Using the Setup Script (Recommended)
Run the setup script to create a .env file:
```bash
npm run setup
```

### Method 2: Manual Configuration
1. Copy the example .env file:
   ```bash
   copy .env.example .env
   ```
   
2. Edit the .env file and add your GitHub Personal Access Token:
   ```
   GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
   ```

## Starting the Server

To start the server, run:
```bash
npm start
```

The server will start and listen for MCP requests on stdin/stdout.

## Using the Server with Kilo Code

The GitHub MCP server is automatically configured in your Kilo Code settings. Once you have configured your GitHub token, you can use the following tools:

### Available Tools

1. **get_repository_info** - Get information about a specific repository
2. **list_repository_issues** - List issues in a repository
3. **create_issue** - Create a new issue in a repository
4. **get_user_info** - Get information about a GitHub user
5. **list_user_repositories** - List repositories for a user

### Example Commands

You can use these tools by asking Kilo Code to perform GitHub-related tasks:

- "Get information about the microsoft/vscode repository"
- "List open issues in the facebook/react repository"
- "Create a new issue in my repository"
- "Show me information about the torvalds user on GitHub"
- "List repositories for the octocat user"

## Testing

To test the server, run:
```bash
npm test
```

This will run a simple test to verify that the server is working correctly.

## Troubleshooting

### Common Issues

1. **"GITHUB_PERSONAL_ACCESS_TOKEN environment variable is required"**
   - Solution: Make sure you have configured your GitHub token in the .env file

2. **"GitHub API error: Bad credentials"**
   - Solution: Verify that your GitHub token is correct and has not expired

3. **"GitHub API error: Not Found"**
   - Solution: Verify that the repository or user you are trying to access exists

### Getting Help

If you encounter any issues, please check the README.md file or create an issue in the repository.