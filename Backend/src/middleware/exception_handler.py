from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

def register_exception_handlers(server: FastAPI) -> None:


    @server.exception_handler(HTTPException)
    def http_exception_handler(request: Request, err: HTTPException) -> JSONResponse:
        print("HTTP Error: ", str(err))
        message = err.detail
        return JSONResponse(status_code = err.status_code, content = { "message": message })


    @server.exception_handler(RequestValidationError)
    def validation_exception_handler(request: Request, err: RequestValidationError) -> JSONResponse:
        print("Validation Error: ", str(err))
        try:
            all_errors = err.errors()
            first_error = all_errors[0]
            prop_name = first_error["loc"][1]
            err_msg = first_error["msg"]
            message = f"Invalid {prop_name}: {err_msg}"
        except:
            message = str(err) # If failed to extract error message - return entire exception
        return JSONResponse(status_code = status.HTTP_400_BAD_REQUEST, content = { "message": message })


    @server.exception_handler(Exception)
    def general_exception_handler(request: Request, err: Exception) -> JSONResponse:
        print("General Error: ", str(err))
        message = str(err)
        return JSONResponse(status_code = status.HTTP_500_INTERNAL_SERVER_ERROR, content = { "message": message })
