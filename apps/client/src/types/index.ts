export interface InitializeResponse {
  serverInfo: { name: string; version: string };
  capabilities: {
    tools?: any;
    resources?: any;
  };
}

export type Content = {
  text: string;
};

export type Tool = {
  name: string;
  description: string;
  inputSchema: {
    properties: Record<string, any>;
  };
};

export type Resource = {
  uri: string;
  name: string;
};

export type Message = {
  type?: string;
  role: string;
  content: any;
  name?: string;
  input?: any;
};

type TextPromptResult = {
  type: "text";
  text: string;
};

type ToolUsePromptResult = {
  type: "tool_use";
  id: string;
  name: string;
  input: Record<string, any>;
};

export type PromptResult = TextPromptResult | ToolUsePromptResult;
