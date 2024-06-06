import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.responses import Response
from app.utils.response import error_response
from fastapi import status

logger = logging.getLogger(__name__)

class ExceptionHandlingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        try:
            response = await call_next(request)
            return response
        except Exception as exc:
            logger.error(f"Unhandled error: {exc}", exc_info=True)
            return error_response(
                message=f"Internal Server Error",
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"{str(exc)}",
            )