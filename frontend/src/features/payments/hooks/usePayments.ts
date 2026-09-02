import { useEffect } from 'react'
import { paymentStore, usePaymentStore } from '../store'

export function usePayments({ enabled = true }: { enabled?: boolean } = {}) {
  const state = usePaymentStore()
  useEffect(() => { if (enabled && !state.initialized && !state.loading) paymentStore.fetch().catch(() => undefined) }, [enabled, state.initialized, state.loading])
  return { ...state, refresh: paymentStore.fetch, initiatePayment: paymentStore.initiate, refundPayment: paymentStore.refund }
}