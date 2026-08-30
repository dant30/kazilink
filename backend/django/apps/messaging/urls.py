from django.urls import path

from .views.admin_views import ConversationAdminListView
from .views.api_views import ConversationDetailView, ConversationListCreateView, MarkConversationReadView, MessageListCreateView

app_name = 'messaging'

urlpatterns = [
	path('', ConversationListCreateView.as_view(), name='conversation-list-create'),
	path('admin/list/', ConversationAdminListView.as_view(), name='conversation-admin-list'),
	path('<int:pk>/', ConversationDetailView.as_view(), name='conversation-detail'),
	path('<int:conversation_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
	path('<int:conversation_id>/read/', MarkConversationReadView.as_view(), name='conversation-read'),
]
