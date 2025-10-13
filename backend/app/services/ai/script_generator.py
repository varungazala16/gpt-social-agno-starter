"""Video script generation agent using Agno AI"""

from collections.abc import Iterator

from agno.agent import Agent, RunOutput, RunOutputEvent
from agno.models.anthropic import Claude

from app.core.config import settings


class ScriptGeneratorAgent:
    """Agent for generating social media video scripts"""

    def __init__(self) -> None:
        """Initialize the script generator agent with platform-specific instructions"""
        self.agent = Agent(
            model=Claude(id=settings.DEFAULT_LLM_MODEL, api_key=settings.ANTHROPIC_API_KEY),
            instructions=[
                "You are an expert social media video scriptwriter and content strategist.",
                "Generate engaging, platform-optimized scripts that capture attention within the first 3 seconds.",
                "Structure scripts with: HOOK (attention-grabbing opener), BODY (main content), and CTA (call-to-action).",
                "Use conversational language and include suggested pauses, emphasis, and timing cues.",
                "Consider platform constraints: TikTok (15-60s), Instagram Reels (15-90s), YouTube Shorts (15-60s).",
                "Include visual direction suggestions inline with the script.",
            ],
            markdown=True,
        )

    def _build_prompt(self, user_prompt: str, platform: str, duration: int | None, tone: str) -> str:
        """Build the complete prompt with context"""
        prompt_parts = [
            f"Platform: {platform.upper()}",
            f"Tone: {tone}",
        ]

        if duration:
            prompt_parts.append(f"Target Duration: {duration} seconds")

        prompt_parts.extend(
            [
                "",
                "Video Concept:",
                user_prompt,
                "",
                "Generate a complete video script with:",
                "1. HOOK - Attention-grabbing opening (first 3 seconds)",
                "2. BODY - Main content with value/entertainment",
                "3. CTA - Clear call-to-action at the end",
                "",
                "Include [VISUAL: ...] cues for suggested on-screen elements.",
            ]
        )

        return "\n".join(prompt_parts)

    async def generate_script(
        self, prompt: str, platform: str, duration: int | None = None, tone: str = "casual"
    ) -> RunOutput:
        """Generate a complete script (non-streaming)"""
        full_prompt = self._build_prompt(prompt, platform, duration, tone)
        return self.agent.run(full_prompt)

    def stream_script(
        self, prompt: str, platform: str, duration: int | None = None, tone: str = "casual"
    ) -> Iterator[RunOutputEvent | RunOutput]:
        """Stream script generation chunk by chunk"""
        full_prompt = self._build_prompt(prompt, platform, duration, tone)

        return self.agent.run(full_prompt, stream=True, stream_intermediate_steps=True)
