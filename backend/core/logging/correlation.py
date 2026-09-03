import logging
from contextvars import ContextVar

correlation_id: ContextVar[str] = ContextVar('correlation_id', default='-')


class CorrelationIdFilter(logging.Filter):
	def filter(self, record: logging.LogRecord) -> bool:
		record.correlation_id = correlation_id.get()
		return True
