from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Conversation
from .services import send_message


class ChatConsumer(AsyncJsonWebsocketConsumer):
	async def connect(self):
		self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
		self.user = await self.get_user_from_token(self.scope.get('access_token'))
		self.conversation = await self.get_conversation()
		if self.user is None or self.conversation is None or not await self.is_participant():
			await self.close(code=4403)
			return
		self.group_name = f'conversation_{self.conversation_id}'
		await self.channel_layer.group_add(self.group_name, self.channel_name)
		await self.accept()

	async def disconnect(self, close_code):
		if hasattr(self, 'group_name'):
			await self.channel_layer.group_discard(self.group_name, self.channel_name)

	async def receive_json(self, content, **kwargs):
		text = str(content.get('text', '')).strip()
		if not text:
			await self.send_json({'error': 'Message text is required.'})
			return
		try:
			message = await self.create_message(text)
		except PermissionError:
			await self.send_json({'error': 'Only conversation participants can send messages.'})
			return
		await self.channel_layer.group_send(
			self.group_name,
			{'type': 'chat.message', 'message': message},
		)

	async def chat_message(self, event):
		await self.send_json(event['message'])

	@database_sync_to_async
	def get_user_from_token(self, raw_token):
		if not raw_token:
			return None
		try:
			validated = JWTAuthentication().get_validated_token(raw_token)
			return JWTAuthentication().get_user(validated)
		except Exception:
			return None

	@database_sync_to_async
	def get_conversation(self):
		return Conversation.objects.select_related('worker__user', 'employer__user').filter(pk=self.conversation_id).first()

	@database_sync_to_async
	def is_participant(self):
		return self.user.id in (self.conversation.worker.user_id, self.conversation.employer.user_id)

	@database_sync_to_async
	def create_message(self, text):
		message = send_message(conversation=self.conversation, sender=self.user, text=text)
		return {
			'id': message.id,
			'conversation': message.conversation_id,
			'sender': message.sender_id,
			'sender_name': message.sender.full_name,
			'sender_role': message.sender_role,
			'text': message.text,
			'timestamp': message.timestamp.isoformat(),
		}
