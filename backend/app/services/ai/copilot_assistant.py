"""CopilotKit Assistant Agent for answering questions about the video studio"""

from typing import Any

from agno.workflow import StepOutput, Workflow
from openai import OpenAI

from app.core.config import settings


class CopilotAssistantAgent:
    """Agent that answers questions about the current page and video studio state"""

    def __init__(self) -> None:
        self.client = OpenAI()


async def analyze_context(step_input: Any) -> dict[str, Any]:
    """Analyze the user's question and current page context"""

    messages = step_input.additional_data["messages"]
    state = step_input.additional_data.get("state", {})

    # Extract relevant context
    context_info = _build_context_string(state)

    # Build system prompt
    system_prompt = f"""You are a helpful assistant for a video studio application called GPT.social.

Current Page Context:
{context_info}

Your role is to:
- Answer questions about the video studio features
- Explain how to use upload, record, and edit features
- Provide information about the user's videos and credits
- Help with troubleshooting and guidance

Be concise, friendly, and helpful. Base your answers on the actual page context provided."""

    # Prepare messages for OpenAI
    openai_messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    for msg in messages:
        if msg.role == "user":
            openai_messages.append({"role": "user", "content": msg.content})
        elif msg.role == "assistant":
            openai_messages.append({"role": "assistant", "content": msg.content})

    step_input.additional_data["openai_messages"] = openai_messages
    step_input.additional_data["context_info"] = context_info

    return dict(step_input.additional_data)


async def generate_response(step_input: Any) -> StepOutput:
    """Generate response using OpenAI"""

    openai_messages = step_input.additional_data["openai_messages"]
    client = OpenAI(api_key=settings.OPENAI_API_KEY)

    # Call OpenAI
    response = client.chat.completions.create(
        model="gpt-4o-mini",  # Use cost-effective model
        messages=openai_messages,
        temperature=0.7,
        max_tokens=500,
    )

    assistant_message = response.choices[0].message.content

    step_input.additional_data["response"] = assistant_message
    if response.usage:
        step_input.additional_data["usage"] = {
            "prompt_tokens": response.usage.prompt_tokens,
            "completion_tokens": response.usage.completion_tokens,
            "total_tokens": response.usage.total_tokens,
        }

    return StepOutput(content=step_input.additional_data)


def _build_context_string(state: dict[str, Any]) -> str:
    """Build a human-readable context string from the state"""

    context_parts = []

    # Current tab
    if "currentTab" in state:
        context_parts.append(f"Current Tab: {state['currentTab']}")

    # Video count
    if "videoCount" in state:
        count = state["videoCount"]
        context_parts.append(f"Videos in Gallery: {count}")

    # User credits
    if "userCredits" in state:
        credits = state["userCredits"]
        context_parts.append(f"Available Credits: {credits}")

    # Page type
    if "pageType" in state:
        context_parts.append(f"Application: {state['pageType']}")

    # Features
    if "features" in state:
        features = ", ".join(state["features"])
        context_parts.append(f"Available Features: {features}")

    return "\n".join(context_parts) if context_parts else "No context available"


# Create workflow instance
copilot_assistant_workflow = Workflow(
    name="CopilotAssistant",
    steps=[analyze_context, generate_response],  # type: ignore[list-item]
)
