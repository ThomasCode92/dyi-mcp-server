# DYI MCP Server

The project demonstrates how to create a custom MCP server and client from the
ground up without relying on third-party libraries. It also illustrates how to
integrate this client with an AI agent.

> This project is based on a couple of YouTube videos by Jack Herrington:
>
> - [Build a Custom MCP Server in 15 Minutes](https://www.youtube.com/watch?v=nTMSyldeVSw)
> - [MCP Client Setup in 10 Minutes](https://www.youtube.com/watch?v=S2x1bsMk19I)
> - [AI Tool Calling](https://www.youtube.com/watch?v=PD2ecDWbeNk)

## ☕ About This MCP Server

This MCP server implements a **coffee shop** interface that allows AI agents to:

- Browse available coffee drinks (Latte, Mocha, Flat White)
- Get detailed information about each drink including prices and descriptions

The coffee shop MCP provides a practical example of building custom MCP tools
that integrate with AI agents for real-world applications.

## 🛠️ Core Technologies

- [Node.js](https://nodejs.org/) - JavaScript runtime.
- [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that
  adds static types.
- [Model Context Protocol](https://modelcontextprotocol.io/) - The protocol for
  building AI applications.

## 📚 Additional Resources

For detailed instructions on interacting with each component:

- **[MCP Server README](./apps/server/README.md)** - Learn how to run and
  configure the MCP server, use the inspector interface, and connect external
  clients.
- **[MCP Client README](./apps/client/README.md)** - Discover how to set up AI
  agent connections, run the client, and use the interactive terminal interface.
