from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware

class LoggerMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next: Callable) -> Response:

        # Log data:         
        print("Method:", request.method)
        print("Route: ", request.url.path)
        
        # # Print body:
        # try:
        #     bytes = await request.body()
        #     # body = bytes.decode("utf-8", errors = "replace") # replace = unicode char of ?
        #     body = bytes.decode("utf-8")
        #     if body: print("Body: ", body)
        # except: pass

        # Call to next middleware:
        response = await call_next(request)

        # Return response: 
        return response
