export type Conversation = { id: number; worker: number; employer: number; job: number | null; last_message: string; last_timestamp: string | null }
export type Message = { id: number; conversation: number; sender: number; sender_name: string; sender_role: string; text: string; timestamp: string; read: boolean }
