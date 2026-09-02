export type FraudSeverity = 'low' | 'medium' | 'high' | (string & {})
export type FraudStatus = 'pending' | 'resolved' | 'dismissed' | (string & {})
export type FraudAlert = { id: number; target_type: string; target_id: string; target_name: string; reason: string; severity: FraudSeverity; status: FraudStatus; detected_at: string; details: string; resolved_at: string | null; resolved_by: number | null }
export type FraudAlertListResponse = FraudAlert[] | { count: number; next: string | null; previous: string | null; results: FraudAlert[] }
