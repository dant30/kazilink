export type AuditLog = { id: number; actor: number | null; actor_name: string | null; action: string; target_type: string; target_id: string; metadata: Record<string, unknown>; created_at: string }
