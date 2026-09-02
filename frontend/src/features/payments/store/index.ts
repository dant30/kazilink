import { useSyncExternalStore } from 'react'
import { paymentServices } from '../services'
import type { PaymentInitiateInput, Transaction } from '../types'

type State = { transactions: Transaction[]; loading: boolean; processing: boolean; initialized: boolean; error: string | null; notice: string | null }
const initialState: State = { transactions: [], loading: false, processing: false, initialized: false, error: null, notice: null }
let state = initialState
const listeners = new Set<() => void>()
const notify = () => listeners.forEach((listener) => listener())
const errorMessage = (error: unknown) => error instanceof Error ? error.message : 'Unable to complete the payment request.'
let request: Promise<Transaction[]> | null = null

export const paymentStore = {
	getState: () => state,
	subscribe: (listener: () => void) => { listeners.add(listener); return () => listeners.delete(listener) },
	async fetch() {
		if (request) return request
		state = { ...state, loading: true, error: null }; notify()
		request = paymentServices.listTransactions().then((transactions) => { state = { ...state, transactions, loading: false, initialized: true }; notify(); return transactions }).catch((error) => { state = { ...state, loading: false, initialized: true, error: errorMessage(error) }; notify(); throw error }).finally(() => { request = null })
		return request
	},
	async initiate(data: PaymentInitiateInput) { state = { ...state, processing: true, error: null, notice: null }; notify(); try { const result = await paymentServices.initiate(data); state = { ...state, transactions: [result.transaction, ...state.transactions], processing: false, notice: 'Payment prompt sent. Complete it on your phone.' }; notify(); return result } catch (error) { state = { ...state, processing: false, error: errorMessage(error) }; notify(); throw error } },
	async refund(id: number) { state = { ...state, processing: true, error: null, notice: null }; notify(); try { const transaction = await paymentServices.refund(id); state = { ...state, transactions: state.transactions.map((item) => item.id === id ? transaction : item), processing: false, notice: 'Refund requested successfully.' }; notify(); return transaction } catch (error) { state = { ...state, processing: false, error: errorMessage(error) }; notify(); throw error } },
}

export function usePaymentStore() { return useSyncExternalStore(paymentStore.subscribe, paymentStore.getState, paymentStore.getState) }
