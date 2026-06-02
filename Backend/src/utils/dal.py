

from pymongo import MongoClient
from utils.app_config import AppConfig



class Dal:
    def __init__(self):
        self.client = MongoClient(AppConfig.connection_string)
        self.database = self.client[AppConfig.database_name]


    def get_collection(self, collection_name: str):
        return self.database[collection_name]
    


dal = Dal()