from openai import OpenAI
from utils.app_config import AppConfig


client = OpenAI(
    api_key=AppConfig.OPENAI_API_KEY
)


class OpenAiService:
    @staticmethod
    def ask_chatGpt(history:list):
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=history
        )

        return response.choices[0].message.content