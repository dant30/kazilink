from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAdminUser

from ..models import Conversation
from ..serializers import ConversationSerializer


class ConversationAdminListView(ListAPIView):
	permission_classes = [IsAdminUser]
	serializer_class = ConversationSerializer
	queryset = Conversation.objects.select_related('worker__user', 'employer__user', 'job').order_by('-last_timestamp')
	search_fields = ('worker__user__full_name', 'employer__user__full_name', 'last_message')
