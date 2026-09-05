from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import CreditLedgerEntry, CreditRecharge, CreditWallet
from ..serializers import CreditLedgerEntrySerializer, CreditRechargeSerializer, CreditWalletSerializer


class CreditWalletAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = CreditWalletSerializer
	queryset = CreditWallet.objects.select_related('user').all()
	search_fields = ('user__phone', 'user__full_name')


class CreditRechargeAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = CreditRechargeSerializer
	queryset = CreditRecharge.objects.select_related('wallet__user').all()
	search_fields = ('wallet__user__phone', 'wallet__user__full_name', 'provider_reference')


class CreditLedgerAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = CreditLedgerEntrySerializer
	queryset = CreditLedgerEntry.objects.select_related('wallet__user').all()
	search_fields = ('wallet__user__phone', 'wallet__user__full_name', 'reference', 'idempotency_key')
