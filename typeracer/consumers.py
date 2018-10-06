from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class TypeRacerConsumer(WebsocketConsumer):
	def connect(self):
		self.race_id = self.scope['url_route']['kwargs']['race_id']
		async_to_sync(self.channel_layer.group_add)(
			self.race_id,
			self.channel_name
			)
		self.accept()
		async_to_sync(self.channel_layer.group_send)(
			self.race_id,
			{
				"type":"shareEvent",
				"message":{"connected_to_lobby":True,"race_id":self.race_id}
			}
		)
	def receive(self,text_data):
		print(self.race_id)
		text_data_json = json.loads(text_data);
		async_to_sync(self.channel_layer.group_send)(
			self.race_id,
			{
				"type":"shareEvent",
				"message":text_data_json
			})
	def shareEvent(self,event):
		self.send(text_data=json.dumps(event))
	def disconnect(self,close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.race_id,
			self.channel_name)
		self.send(text_data=json.dumps({"disconnected_from_lobby":True,"race_id":self.race_id}))
