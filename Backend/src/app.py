from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from controllers.chat_controller import router as chat_router
from controllers.conversation_controller import router as conversation_router
from middleware.exception_handler import register_exception_handlers
from middleware.logger_middleware import LoggerMiddleware
from uvicorn import run

#start server fast api
server = FastAPI()


#cors to help front to connect 
server.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#middleware
server.add_middleware(LoggerMiddleware)
register_exception_handlers(server)

#controllers
server.include_router(chat_router)
server.include_router(conversation_router)



if __name__ == "__main__":
    run("app:server", port=4000, reload=True)