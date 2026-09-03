const CORRELATION_HEADER = 'X-Correlation-ID'

export function createCorrelationId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID()
	return `kl-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

export function getCorrelationId(headers: unknown): string | undefined {
	if (!headers || typeof headers !== 'object') return undefined
	const value = (headers as Record<string, unknown>)[CORRELATION_HEADER] ?? (headers as Record<string, unknown>)['x-correlation-id']
	return typeof value === 'string' && value ? value : undefined
}

export { CORRELATION_HEADER }
