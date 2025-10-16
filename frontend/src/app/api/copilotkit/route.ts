import {
  CopilotRuntime,
  copilotRuntimeNextJSAppRouterEndpoint,
  OpenAIAdapter,
} from "@copilotkit/runtime"
import { HttpAgent } from "@ag-ui/client"
import { NextRequest } from "next/server"

// Create agent connection to your FastAPI backend
const copilotAgent = new HttpAgent({
  url: process.env.NEXT_PUBLIC_API_BASE_URL
    ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/copilot/agno-agent`
    : "http://localhost:8000/api/v1/copilot/agno-agent",
})

// Configure OpenAI Service Adapter
const serviceAdapter = new OpenAIAdapter()

// Initialize CopilotKit Runtime
const runtime = new CopilotRuntime({
  agents: {
    // @ts-ignore
    copilotAgent: copilotAgent,
  },
})

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  })

  return handleRequest(req)
}
