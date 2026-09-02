import { endpoints } from '../../../core/api'
import type { Conversation, Message, MessagePage } from '../types'

const results = <T>(value: T[] | { results: T[] }) => Array.isArray(value) ? value : value.results

export const messagingServices = {
	async listConversations(): Promise<Conversation[]> {
		return results(await endpoints.messaging.conversations())
	},
	getConversation: (id: number) => endpoints.messaging.conversation(id),
	async listMessages(id: number): Promise<Message[]> {
		return results(await endpoints.messaging.messages(id) as MessagePage)
	},
	sendMessage: (id: number, text: string): Promise<Message> => endpoints.messaging.sendMessage(id, text),
	markRead: (id: number) => endpoints.messaging.markRead(id),
}
