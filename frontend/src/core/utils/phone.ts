const KENYAN_MOBILE = /^(?:\+254|254|0)7\d{8}$/

export function normalizeKenyanPhone(value: string) {
	const digits = value.replace(/[\s()-]/g, '')
	if (!KENYAN_MOBILE.test(digits)) return ''
	if (digits.startsWith('+254')) return digits
	if (digits.startsWith('254')) return `+${digits}`
	return `+254${digits.slice(1)}`
}

export function isValidKenyanPhone(value: string) {
	return Boolean(normalizeKenyanPhone(value))
}
