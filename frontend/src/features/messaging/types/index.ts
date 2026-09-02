export type Conversation = {
	id: number
	worker: number
	worker_name: string
	employer: number
	employer_name: string
	job: number | null
	last_message: string
	last_timestamp: string | null
	messages?: Message[]
}

export type Message = {
	id: number
	conversation: number
	sender: number
	sender_name: string
	sender_role: string
	text: string
	timestamp: string
	read: boolean
}

export type MessagePage = Message[] | { count: number; next: string | null; previous: string | null; results: Message[] }
