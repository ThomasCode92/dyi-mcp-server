# MCP Client

A STDIO _MCP Client_ build from scratch without any third-party libraries.

> This project is based on the Youtube videos
> '[MCP Client Setup in 10 Minutes](https://www.youtube.com/watch?v=S2x1bsMk19I)'
> and '[AI Tool Calling](https://www.youtube.com/watch?v=PD2ecDWbeNk)' from Jack
> Herrington.

## 🚀 Getting Started

### 🤖 Connecting to an AI Agent

To use the MCP Client, a connection with a LLM is required. This project uses
the [GitHub Copilot Proxy](https://github.com/ericc-ch/copilot-api), which
differs from the original videos that demonstrate integration with the Anthropic
API.

### ▶️ Running the MCP Client

Use the following commands to start the MCP client:

```bash
pnpm run dev    # start the server in development mode
pnpm run start  # start the server in production mode
```

### 🔗 Interacting with the MCP Client

An interactive terminal interface is also available for communicating with the
MCP Client. It can be used to run tools, request resources, or chat with the AI
agent.
