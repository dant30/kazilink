def build_reference_request(record):
	return {
		'record_id': record.id,
		'contact_name': record.reference_contact_name,
		'contact_phone': record.reference_contact_phone,
		'establishment': record.establishment_name,
		'position': record.position,
	}
