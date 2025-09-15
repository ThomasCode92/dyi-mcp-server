# MCP Server

A STDIO MCP server build from scratch without any third-party libraries.

> This project is based on the Youtube video
> '[Build a custom mcp server in 15 mins](https://www.youtube.com/watch?v=nTMSyldeVSw)'
> from Jack Herrington.

## 🚀 Getting Started

### ▶️ Running the MCP Server

Use the following commands to start the MCP Server:

```bash
pnpm run dev    # start the server in development mode
pnpm run start  # start the server in production mode

```

### 🔗 Interacting with the MCP Server

There are two primary ways to interact with the MCP Server.

1. **Inspector** – a web-based interface for exploring the server. You can
   launch it with:

   ```bash
   pnpm run inspector
   ```

2. **Client** – for example, [opencode](https://opencode.ai/). To connect a
   client, use the following configuration:

   ```json
      "mcp": {
        "coffee-shop": {
          "type": "local",
          "enabled": true,
          "command": ["pnpm", "run", "start"]
        }
      }
   ```
