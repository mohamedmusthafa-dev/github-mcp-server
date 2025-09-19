# Running GitHub MCP Tools

This document explains how to run the `list_repository_issues` tool and other tools provided by the GitHub MCP server.

## Prerequisites

1. Ensure you have Node.js installed
2. Make sure your GitHub Personal Access Token is set in the `.env` file
3. Install dependencies by running `npm install` if you haven't already

## Running the list_repository_issues Tool

### Method 1: Using the Node.js script

```bash
node run-list-issues.js
```

This will run the tool with default parameters (listing open issues in the facebook/react repository).

### Method 2: Using the Windows batch file

Double-click on `run-list-issues.bat` or run it from the command line:

```cmd
run-list-issues.bat
```

### Method 3: Customizing the parameters

To customize which repository and issues to list:

1. Edit the `run-list-issues.js` file
2. Modify the `params` section:
   ```javascript
   params: {
     owner: "your-username",     // Repository owner
     repo: "your-repo",          // Repository name
     state: "open"               // Can be "open", "closed", or "all"
   }
   ```
3. Run the script using one of the methods above

## Other Available Tools

The GitHub MCP server provides these additional tools:

1. `get_repository_info` - Get information about a specific repository
2. `create_issue` - Create a new issue in a repository
3. `get_user_info` - Get information about a GitHub user
4. `list_user_repositories` - List repositories for a user

## Using with MCP-Compatible Clients

The GitHub MCP server can also be used with any MCP-compatible client. It's already configured in your MCP settings as "github-custom".

## Troubleshooting

1. If you get authentication errors, verify your GitHub Personal Access Token in the `.env` file
2. If the server doesn't start, ensure all dependencies are installed with `npm install`
3. If you get timeout errors, check your internet connection