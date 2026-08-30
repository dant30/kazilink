import csv
from io import StringIO


def export_snapshot_csv(snapshot):
	buffer = StringIO()
	writer = csv.writer(buffer)
	for field in snapshot._meta.fields:
		writer.writerow((field.name, getattr(snapshot, field.name)))
	return buffer.getvalue()
