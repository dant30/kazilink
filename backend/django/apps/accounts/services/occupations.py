WORKER_OCCUPATIONS = (
	('nanny', 'Nanny / Childcare provider'),
	('housekeeper', 'Housekeeper'),
	('cleaner', 'Cleaner'),
	('caregiver', 'Caregiver'),
	('cook', 'Cook / Chef'),
	('waiter', 'Waiter / Waitress'),
	('bartender', 'Bartender'),
	('barista', 'Barista'),
	('receptionist', 'Receptionist'),
	('security_guard', 'Security guard'),
	('driver', 'Driver'),
	('gardener', 'Gardener'),
	('laundry_attendant', 'Laundry attendant'),
	('salon_shampooist', 'Shampooist / Salon assistant'),
	('hairdresser', 'Hairdresser / Stylist'),
	('barber', 'Barber'),
	('makeup_artist', 'Makeup artist'),
	('nail_technician', 'Nail technician'),
	('masseuse', 'Massage therapist'),
	('event_staff', 'Event staff'),
	('shop_attendant', 'Shop attendant'),
	('house_manager', 'House manager'),
	('personal_assistant', 'Personal assistant'),
	('office_cleaner', 'Office cleaner'),
	('dishwasher', 'Dishwasher / Kitchen assistant'),
	('pastry_baker', 'Baker / Pastry assistant'),
	('host_hostess', 'Host / Hostess'),
	('front_desk_agent', 'Front desk agent'),
	('room_attendant', 'Hotel room attendant'),
	('bellhop', 'Bellhop / Porter'),
	('catering_staff', 'Catering staff'),
	('event_coordinator', 'Event coordinator'),
	('photographer', 'Photographer'),
	('videographer', 'Videographer'),
	('tailor', 'Tailor / Dressmaker'),
	('seamstress', 'Seamstress'),
	('shoe_care_attendant', 'Shoe care attendant'),
	('car_wash_attendant', 'Car wash attendant'),
	('delivery_rider', 'Delivery rider'),
	('warehouse_assistant', 'Warehouse assistant'),
	('sales_attendant', 'Sales attendant'),
	('cashier', 'Cashier'),
	('other', 'Other hospitality or domestic role'),
)

WORKER_AVAILABILITIES = (
	('immediate', 'Immediate'),
	('full_time', 'Full time'),
	('part_time', 'Part time'),
	('weekends', 'Weekends'),
	('weekdays', 'Weekdays'),
	('night_shifts', 'Night shifts'),
	('day_shifts', 'Day shifts'),
	('flexible', 'Flexible schedule'),
)


def worker_occupation_catalog():
	return [{'value': value, 'label': label} for value, label in WORKER_OCCUPATIONS]


def worker_availability_catalog():
	return [{'value': value, 'label': label} for value, label in WORKER_AVAILABILITIES]
