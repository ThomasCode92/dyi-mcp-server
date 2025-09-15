# Agent Development Guidelines

## Build Commands
- **Dev**: `pnpm dev:server` or `pnpm dev:client` - Start development servers with watch mode
- **Build**: `pnpm run --filter=server build` or `pnpm run --filter=client build` - TypeScript compilation
- **Start**: `pnpm run --filter=server start` or `pnpm run --filter=client start` - Run compiled output
- **Inspector**: `pnpm run --filter=server inspector` - MCP server debugging

## Code Style
- **TypeScript**: Strict mode enabled, use ESNext target, module type "module"
- **Formatting**: Prettier with 2-space tabs, 80 char width, double quotes, semicolons
- **Imports**: Use `@/` path aliases for src imports, prefer named imports, Node.js imports with "node:" prefix
- **Types**: Use interfaces for object shapes, explicit return types for functions, prefer `any` for JSON parsing
- **Naming**: camelCase for variables/functions, PascalCase for types/interfaces
- **Error Handling**: Use try/catch blocks, return error objects for tools, console.error for debugging
- **Functions**: Prefer async/await over promises, use arrow functions for inline callbacks
- **JSON-RPC**: Follow MCP protocol structure with id, jsonrpc: "2.0", method, params

## Project Structure
- Monorepo with pnpm workspaces (apps/server, apps/client)
- MCP server implementation in TypeScript with STDIO transport
- Path aliases configured: `@/*` maps to `src/*`
- No test framework currently configured