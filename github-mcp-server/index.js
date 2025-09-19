#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

// Try to load environment variables from .env file
try {
  const fs = await import('fs');
  const path = await import('path');
  
  // Look for .env file in the current directory
  const envPath = path.resolve('.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const envLines = envContent.split('\n');
    
    for (const line of envLines) {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, value] = trimmedLine.split('=');
        if (key && value) {
          process.env[key.trim()] = value.trim().replace(/^['"]|['"]$/g, '');
        }
      }
    }
  }
} catch (error) {
  console.error('Error loading .env file:', error.message);
}

const GITHUB_TOKEN = process.env.GITHUB_PERSONAL_ACCESS_TOKEN;
const GITHUB_API_URL = process.env.GITHUB_API_URL || 'https://api.github.com';

// Validate that we have a GitHub token
if (!GITHUB_TOKEN) {
  throw new Error('GITHUB_PERSONAL_ACCESS_TOKEN environment variable is required');
}

// Create an MCP server
const server = new McpServer({
  name: "github-mcp-server",
  version: "0.1.0"
});

// Create axios instance for GitHub API
const githubApi = axios.create({
  baseURL: GITHUB_API_URL,
  headers: {
    'Authorization': `Bearer ${GITHUB_TOKEN}`,
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-MCP-Server'
  }
});

// Tool to get repository information
server.tool(
  "get_repository_info",
  {
    owner: z.string().describe("Repository owner/organization name"),
    repo: z.string().describe("Repository name"),
 },
  async ({ owner, repo }) => {
    try {
      const response = await githubApi.get(`/repos/${owner}/${repo}`);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              name: response.data.name,
              description: response.data.description,
              stars: response.data.stargazers_count,
              forks: response.data.forks_count,
              language: response.data.language,
              created_at: response.data.created_at,
              updated_at: response.data.updated_at,
              url: response.data.html_url
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `GitHub API error: ${error.response?.data?.message ?? error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// Tool to list repository issues
server.tool(
 "list_repository_issues",
  {
    owner: z.string().describe("Repository owner/organization name"),
    repo: z.string().describe("Repository name"),
    state: z.enum(["open", "closed", "all"]).optional().describe("Issue state filter"),
  },
  async ({ owner, repo, state = "open" }) => {
    try {
      const params = { state };
      const response = await githubApi.get(`/repos/${owner}/${repo}/issues`, { params });
      
      const issues = response.data.map(issue => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        created_at: issue.created_at,
        updated_at: issue.updated_at,
        url: issue.html_url
      }));
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(issues, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `GitHub API error: ${error.response?.data?.message ?? error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// Tool to create a new issue
server.tool(
  "create_issue",
  {
    owner: z.string().describe("Repository owner/organization name"),
    repo: z.string().describe("Repository name"),
    title: z.string().describe("Issue title"),
    body: z.string().optional().describe("Issue body content"),
    labels: z.array(z.string()).optional().describe("Labels to apply to the issue"),
  },
  async ({ owner, repo, title, body, labels }) => {
    try {
      const issueData = { title, body, labels };
      const response = await githubApi.post(`/repos/${owner}/${repo}/issues`, issueData);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              number: response.data.number,
              title: response.data.title,
              url: response.data.html_url,
              state: response.data.state
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `GitHub API error: ${error.response?.data?.message ?? error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// Tool to get user information
server.tool(
  "get_user_info",
  {
    username: z.string().describe("GitHub username"),
  },
 async ({ username }) => {
    try {
      const response = await githubApi.get(`/users/${username}`);
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              login: response.data.login,
              name: response.data.name,
              bio: response.data.bio,
              public_repos: response.data.public_repos,
              followers: response.data.followers,
              following: response.data.following,
              created_at: response.data.created_at,
              url: response.data.html_url
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `GitHub API error: ${error.response?.data?.message ?? error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// Tool to list user repositories
server.tool(
  "list_user_repositories",
 {
    username: z.string().describe("GitHub username"),
    sort: z.enum(["created", "updated", "pushed", "full_name"]).optional().describe("Sort order"),
    direction: z.enum(["asc", "desc"]).optional().describe("Sort direction"),
  },
  async ({ username, sort = "full_name", direction = "asc" }) => {
    try {
      const params = { sort, direction };
      const response = await githubApi.get(`/users/${username}/repos`, { params });
      
      const repos = response.data.map(repo => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        language: repo.language,
        created_at: repo.created_at,
        updated_at: repo.updated_at,
        url: repo.html_url
      }));
      
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(repos, null, 2),
          },
        ],
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          content: [
            {
              type: "text",
              text: `GitHub API error: ${error.response?.data?.message ?? error.message}`,
            },
          ],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('GitHub MCP server running on stdio');