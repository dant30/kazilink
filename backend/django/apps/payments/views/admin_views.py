from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Transaction
from ..serializers import TransactionSerializer


class TransactionAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = TransactionSerializer
	queryset = Transaction.objects.select_related('employer__user').all()
	search_fields = ('employer__user__phone', 'employer__user__full_name', 'provider_reference')
