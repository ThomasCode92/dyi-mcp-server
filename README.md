# DYI MCP Server

The project demonstrates how to create a custom MCP server and client from the ground up without relying on third-party libraries.
It also illustrates how to integrate this client with an AI agent.

> This project is based on a couple of YouTube videos by Jack Herrington:
>
> - [Build a custom mcp server in 15 mins](https://www.youtube.com/watch?v=nTMSyldeVSw)
> - [MCP Client Setup in 10 Minutes](https://www.youtube.com/watch?v=S2x1bsMk19I)
> - [AI Tool Calling](https://www.youtube.com/watch?v=PD2ecDWbeNk)

## Getting Started

### Connecting to an AI Agent

This project uses the [GitHub Copilot Proxy](https://github.com/ericc-ch/copilot-api), which differs from the original videos that demonstrate integration with the Anthropic API.

### Running the Server and Client

The following commands start the MCP server or client.
**Note:** when the MCP client is started, an MCP server is automatically spawned as a child process.

```bash
pnpm run dev:server   # start the mcp server, in development mode
pnpm run dev:client   # start the mcp client, in development mode
```
