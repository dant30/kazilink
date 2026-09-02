import { useState } from 'react'
import { employerStore } from '../store'
import type { UpdateEmployerProfilePayload } from '../types'

export function useUpdateEmployerProfile() {
  const [updating, setUpdating] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const updateProfile = async (data: UpdateEmployerProfilePayload) => {
    setUpdating(true); setSuccess(false); setError(null)
    try { const profile = await employerStore.update(data); setSuccess(true); return profile }
    catch (cause) { const message = cause instanceof Error ? cause.message : 'Unable to update employer profile.'; setError(message); throw cause }
    finally { setUpdating(false) }
  }
  return { updating, success, error, updateProfile, clearError: () => setError(null), clearSuccess: () => setSuccess(false) }
}