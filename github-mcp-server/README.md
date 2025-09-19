# GitHub MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with GitHub repositories and issues.

## Features

This MCP server provides the following tools:

1. **get_repository_info** - Get information about a specific repository
2. **list_repository_issues** - List issues in a repository
3. **create_issue** - Create a new issue in a repository
4. **get_user_info** - Get information about a GitHub user
5. **list_user_repositories** - List repositories for a user

## Setup

1. Clone or download this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a GitHub Personal Access Token:
   - Go to GitHub Settings > Developer settings > Personal access tokens > Tokens (classic)
   - Generate a new token with appropriate permissions (repo, read:user, etc.)
   - Copy the token for use in the environment variable

4. Set the environment variable:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN=your_github_token_here
   ```

## Usage

To run the server directly:
```bash
npm start
```

The server will communicate over stdio and can be used with any MCP-compatible client.

## Tools

### get_repository_info
Get information about a specific repository.

Parameters:
- `owner` (string, required): Repository owner/organization name
- `repo` (string, required): Repository name

### list_repository_issues
List issues in a repository.

Parameters:
- `owner` (string, required): Repository owner/organization name
- `repo` (string, required): Repository name
- `state` (string, optional): Issue state filter ("open", "closed", "all")

### create_issue
Create a new issue in a repository.

Parameters:
- `owner` (string, required): Repository owner/organization name
- `repo` (string, required): Repository name
- `title` (string, required): Issue title
- `body` (string, optional): Issue body content
- `labels` (array of strings, optional): Labels to apply to the issue

### get_user_info
Get information about a GitHub user.

Parameters:
- `username` (string, required): GitHub username

### list_user_repositories
List repositories for a user.

Parameters:
- `username` (string, required): GitHub username
- `sort` (string, optional): Sort order ("created", "updated", "pushed", "full_name")
- `direction` (string, optional): Sort direction ("asc", "desc")

## License

MIT