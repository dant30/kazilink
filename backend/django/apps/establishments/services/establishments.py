from django.db import transaction

from ..models import Establishment


@transaction.atomic
def create_establishment(*, owner, validated_data):
    if not getattr(owner, 'is_employer', False):
        raise PermissionError('Only employers can create establishments.')
    establishment = Establishment.objects.create(**validated_data)
    owner.employer_profile.establishment = establishment
    owner.employer_profile.save(update_fields=['establishment'])
    return establishment


@transaction.atomic
def update_establishment(*, establishment, validated_data):
    for field, value in validated_data.items():
        setattr(establishment, field, value)
    establishment.save(update_fields=list(validated_data))
    return establishment


@transaction.atomic
def set_verification_status(*, establishment, verified):
    establishment.is_verified = verified
    establishment.save(update_fields=['is_verified'])
    return establishment
