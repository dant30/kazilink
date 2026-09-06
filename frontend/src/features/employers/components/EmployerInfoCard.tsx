import { Building2 } from 'lucide-react'
import { FormField, FormSection } from '../../../shared/components/forms'
import { Input } from '../../../shared/components/ui/Input'
import { Select } from '../../../shared/components/ui/Select'
import type { UpdateEmployerProfilePayload } from '../types'

type Props = { values: UpdateEmployerProfilePayload; onChange: (field: keyof UpdateEmployerProfilePayload, value: string) => void; businessTypes?: Array<{ value: string; label: string }>; locations?: Array<{ value: string; label: string }> }

export function EmployerInfoCard({ values, onChange, businessTypes = [], locations = [] }: Props) {
  return <FormSection title="Business information" description="Details visible to workers and the admin team." icon={<Building2 className="h-4 w-4" />}>
    <div className="grid gap-4 md:grid-cols-2">
      <FormField label="Business name" required><Input value={values.business_name || ''} onChange={(event) => onChange('business_name', event.target.value)} /></FormField>
      <FormField label="Contact person" required><Input value={values.contact_person || ''} onChange={(event) => onChange('contact_person', event.target.value)} /></FormField>
      <FormField label="Location"><Select searchable value={values.location || ''} onChange={(value) => onChange('location', value)} options={[{ value: '', label: 'Select location' }, ...locations]} /></FormField>
      <FormField label="Business type"><Select searchable value={values.business_type || ''} onChange={(value) => onChange('business_type', value)} options={[{ value: '', label: 'Select business type' }, ...businessTypes]} /></FormField>
    </div>
  </FormSection>
}
