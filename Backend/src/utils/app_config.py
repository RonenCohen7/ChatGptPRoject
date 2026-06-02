


from dotenv import load_dotenv
from os import getenv


load_dotenv()

class AppConfig:
    connection_string= getenv("CONNECTION_STRING")
    database_name:str = getenv("DB_NAME")
    OPENAI_API_KEY = getenv("OPENAI_API_KEY")