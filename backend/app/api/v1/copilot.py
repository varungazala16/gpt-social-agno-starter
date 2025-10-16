"""CopilotKit AG-UI endpoint"""

import asyncio
import uuid
from typing import Any

from ag_ui.core import (
    EventType,
    RunAgentInput,
    RunFinishedEvent,
    RunStartedEvent,
    StateSnapshotEvent,
    TextMessageContentEvent,
    TextMessageEndEvent,
    TextMessageStartEvent,
)
from ag_ui.encoder import EventEncoder
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.services.ai.copilot_assistant import copilot_assistant_workflow

router = APIRouter()


@router.post("/agno-agent")
async def copilot_agent(input_data: RunAgentInput) -> StreamingResponse:
    """
    AG-UI protocol endpoint for CopilotKit integration.

    Streams responses following the AG-UI event protocol.
    """

    async def event_generator() -> Any:
        encoder = EventEncoder()

        try:
            # Step 1: Send RUN_STARTED event
            yield encoder.encode(
                RunStartedEvent(
                    type=EventType.RUN_STARTED,
                    thread_id=input_data.thread_id,
                    run_id=input_data.run_id,
                )
            )

            # Step 2: Send state snapshot
            yield encoder.encode(
                StateSnapshotEvent(
                    type=EventType.STATE_SNAPSHOT,
                    snapshot=input_data.state,
                )
            )

            # Step 3: Run the agent workflow
            result = await copilot_assistant_workflow.arun(
                additional_data={
                    "messages": input_data.messages,
                    "tools": input_data.tools,
                    "state": input_data.state,
                }
            )

            # Step 4: Extract response from the final step result
            # The workflow returns WorkflowRunOutput with step_results array
            response_text = ""
            if result.content and isinstance(result.content, dict):
                response_text = result.content.get("response", "")

            # Step 5: Stream text message
            message_id = str(uuid.uuid4())

            # Start message
            yield encoder.encode(
                TextMessageStartEvent(
                    type=EventType.TEXT_MESSAGE_START,
                    message_id=message_id,
                    role="assistant",
                )
            )

            # Stream content in chunks for typing effect
            if response_text:
                chunk_size = max(1, len(response_text) // 50)
                for i in range(0, len(response_text), chunk_size):
                    chunk = response_text[i : i + chunk_size]
                    yield encoder.encode(
                        TextMessageContentEvent(
                            type=EventType.TEXT_MESSAGE_CONTENT,
                            message_id=message_id,
                            delta=chunk,
                        )
                    )
                    await asyncio.sleep(0.03)  # Typing effect
            else:
                # Fallback message
                yield encoder.encode(
                    TextMessageContentEvent(
                        type=EventType.TEXT_MESSAGE_CONTENT,
                        message_id=message_id,
                        delta="I'm here to help! What would you like to know?",
                    )
                )

            # End message
            yield encoder.encode(
                TextMessageEndEvent(
                    type=EventType.TEXT_MESSAGE_END,
                    message_id=message_id,
                )
            )

            # Step 6: Send RUN_FINISHED event
            yield encoder.encode(
                RunFinishedEvent(
                    type=EventType.RUN_FINISHED,
                    thread_id=input_data.thread_id,
                    run_id=input_data.run_id,
                )
            )

        except Exception as e:
            # Error handling - still send RUN_FINISHED
            print(f"Error in copilot agent: {e}")
            yield encoder.encode(
                RunFinishedEvent(
                    type=EventType.RUN_FINISHED,
                    thread_id=input_data.thread_id,
                    run_id=input_data.run_id,
                )
            )

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
