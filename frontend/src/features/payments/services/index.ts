import { endpoints } from '../../../core/api'
import type { PaymentInitiateInput, PaymentInitiateResponse, Transaction, TransactionListResponse } from '../types'

const results = (value: TransactionListResponse) => Array.isArray(value) ? value : value.results

export const paymentServices = {
	async listTransactions(): Promise<Transaction[]> { return results(await endpoints.payments.list()) },
	getTransaction: (id: number): Promise<Transaction> => endpoints.payments.detail(id),
	initiate: (data: PaymentInitiateInput): Promise<PaymentInitiateResponse> => endpoints.payments.create(data),
	refund: (id: number): Promise<Transaction> => endpoints.payments.refund(id),
}
