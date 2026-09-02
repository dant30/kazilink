import { useSyncExternalStore } from 'react'
import { supportServices } from '../services'
import type { SupportTicket, SupportTicketInput } from '../types'

type State = { tickets: SupportTicket[]; loading: boolean; submitting: boolean; error: string | null; initialized: boolean }
const initialState: State = { tickets: [], loading: false, submitting: false, error: null, initialized: false }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to complete the support request.'
let listRequest: Promise<SupportTicket[]> | null = null

export const supportStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch() {
		if (listRequest) return listRequest
		state = { ...state, loading: true, error: null }; notify()
		listRequest = supportServices.listTickets()
			.then((tickets) => { state = { ...state, tickets, loading: false, initialized: true }; notify(); return tickets })
			.catch((error) => { state = { ...state, loading: false, initialized: true, error: errorMessage(error) }; notify(); throw error })
			.finally(() => { listRequest = null })
		return listRequest
	},
	async create(data: SupportTicketInput) {
		state = { ...state, submitting: true, error: null }; notify()
		try { const ticket = await supportServices.createTicket(data); state = { ...state, tickets: [ticket, ...state.tickets], submitting: false }; notify(); return ticket }
		catch (error) { state = { ...state, submitting: false, error: errorMessage(error) }; notify(); throw error }
	},
	async close(id: number) {
		try { const ticket = await supportServices.closeTicket(id); state = { ...state, tickets: state.tickets.map((item) => item.id === id ? ticket : item) }; notify(); return ticket }
		catch (error) { state = { ...state, error: errorMessage(error) }; notify(); throw error }
	},
}

export function useSupport() { return useSyncExternalStore(supportStore.subscribe, supportStore.getState, supportStore.getState) }
