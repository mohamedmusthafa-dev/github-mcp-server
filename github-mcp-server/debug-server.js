#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

console.log('Starting debug server...');

// Create an MCP server
const server = new McpServer({
  name: "github-mcp-server-debug",
  version: "0.1.0"
});

// Add a simple test tool
server.tool(
  "test_tool",
  {
    message: z.string().describe("A test message"),
  },
  async ({ message }) => {
    console.log('Test tool called with message:', message);
    return {
      content: [
        {
          type: "text",
          text: `Echo: ${message}`,
        },
      ],
    };
  }
);

console.log('Available tools:', server.getTools());

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);
console.error('Debug MCP server running on stdio');