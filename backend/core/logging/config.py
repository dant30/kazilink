LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'filters': {
        'correlation_id': {'()': 'core.logging.correlation.CorrelationIdFilter'},
    },
    'formatters': {
        'standard': {'format': '{levelname} {asctime} {name} [{correlation_id}] {message}', 'style': '{'},
    },
    'handlers': {
        'console': {'class': 'logging.StreamHandler', 'formatter': 'standard', 'filters': ['correlation_id']},
    },
    'root': {'handlers': ['console'], 'level': 'INFO'},
}
