import base64
import json
import time
import uuid
from pathlib import Path

from openai import OpenAI
from utils.app_config import AppConfig


client = OpenAI(
    api_key=AppConfig.OPENAI_API_KEY
)

GENERATED_DIR = Path(__file__).resolve().parent.parent.parent / "generated"
GENERATED_DIR.mkdir(parents=True, exist_ok=True)

TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "generate_image",
            "description": "Generate an image when the user asks to create, draw, or generate an image, picture, or photo.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "Detailed description of the image to generate, in English",
                    }
                },
                "required": ["prompt"],
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "generate_video",
            "description": "Generate a video when the user asks to create or generate a video, animation, or clip.",
            "parameters": {
                "type": "object",
                "properties": {
                    "prompt": {
                        "type": "string",
                        "description": "Detailed description of the video to generate, in English",
                    }
                },
                "required": ["prompt"],
            },
        },
    },
]


class OpenAiService:

    @staticmethod
    def ask_chatGpt(history: list):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=history
        )

        return response.choices[0].message.content

    @staticmethod
    def ask_chatGpt_with_tools(history: list):
        system_message = {
            "role": "system",
            "content": (
                "You are a helpful assistant. "
                "When the user asks to create or generate an image, picture, or photo, use generate_image. "
                "When the user asks to create or generate a video or animation, use generate_video. "
                "Always write media prompts in English, even if the user writes in another language. "
                "For all other requests, respond with text only."
            ),
        }
        messages = [system_message] + history

        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=messages,
            tools=TOOLS,
            tool_choice="auto",
        )

        message = response.choices[0].message

        if message.tool_calls:
            tool_call = message.tool_calls[0]
            function_name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            prompt = args.get("prompt", "")

            try:
                if function_name == "generate_image":
                    url = OpenAiService.generate_image(prompt)
                    return {"type": "image", "content": url}
                if function_name == "generate_video":
                    reference_image = OpenAiService._find_last_image_in_history(history)
                    url = OpenAiService.generate_video(prompt, reference_image)
                    return {"type": "video", "content": url}
            except Exception as e:
                return {
                    "type": "text",
                    "content": f"Sorry, media generation failed: {str(e)}",
                }

        return {"type": "text", "content": message.content or ""}

    @staticmethod
    def generate_image(prompt: str):
        response = client.images.generate(
            model="gpt-image-1",
            prompt=prompt,
            n=1,
            size="1024x1024",
        )

        image_data = response.data[0]

        if image_data.b64_json:
            image_bytes = base64.b64decode(image_data.b64_json)
        elif image_data.url:
            import httpx
            image_bytes = httpx.get(image_data.url).content
        else:
            raise RuntimeError("No image data returned from API")

        filename = f"{uuid.uuid4()}.png"
        file_path = GENERATED_DIR / filename

        with open(file_path, "wb") as f:
            f.write(image_bytes)

        return f"/api/media/files/{filename}"

    @staticmethod
    def _find_last_image_in_history(history: list) -> str | None:
        for message in reversed(history):
            if message.get("role") != "assistant":
                continue
            content = message.get("content", "")
            if content.startswith("/api/media/files/") and content.endswith(
                (".png", ".jpg", ".jpeg", ".webp")
            ):
                return content
        return None

    @staticmethod
    def _video_error_message(video) -> str:
        error = getattr(video, "error", None)
        if error:
            message = getattr(error, "message", None) or str(error)
            code = getattr(error, "code", None)
            if code:
                return f"{message} (code: {code})"
            return message
        return f"Video generation failed with status: {video.status}"

    @staticmethod
    def _poll_video_until_done(video):
        max_wait_seconds = 600
        waited = 0
        while video.status in ("queued", "in_progress"):
            if waited >= max_wait_seconds:
                raise RuntimeError("Video generation timed out after 10 minutes")
            time.sleep(5)
            waited += 5
            video = client.videos.retrieve(video.id)

        if video.status != "completed":
            raise RuntimeError(OpenAiService._video_error_message(video))

        return video

    @staticmethod
    def _save_video_file(video) -> str:
        content = client.videos.download_content(video.id)

        filename = f"{uuid.uuid4()}.mp4"
        file_path = GENERATED_DIR / filename
        content.write_to_file(file_path)

        return f"/api/media/files/{filename}"

    @staticmethod
    def generate_video(prompt: str, reference_image_url: str | None = None):
        create_kwargs = {
            "model": "sora-2",
            "prompt": prompt,
            "size": "1280x720",
            "seconds": "4",
        }

        image_path = None
        if reference_image_url:
            candidate = GENERATED_DIR / Path(reference_image_url).name
            if candidate.exists():
                image_path = candidate

        if image_path:
            try:
                video = client.videos.create(
                    **create_kwargs,
                    input_reference=image_path,
                )
                video = OpenAiService._poll_video_until_done(video)
                return OpenAiService._save_video_file(video)
            except Exception:
                pass

        video = client.videos.create(**create_kwargs)
        video = OpenAiService._poll_video_until_done(video)
        return OpenAiService._save_video_file(video)
