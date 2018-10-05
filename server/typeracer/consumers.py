from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class TypeRacerConsumer(WebsocketConsumer):
	def connect(self):
		self.race_id = "1"
		print("DASDASDASSA")
		async_to_sync(self.channel_layer.group_add)(
			self.race_id,
			self.channel_name
			)
		self.accept()
	def receive(self,text_data):
		print(text_data)
		async_to_sync(self.channel_layer.group_send)(
			self.race_id,
			{
				"type":"getProgress",
				"message":json.loads(text_data)
			})
	def getProgress(self,event):
		self.send(text_data=json.dumps(event))
	def disconnect(self,close_code):
		async_to_sync(self.channel_layer.group_discard)(
			self.race_id,
			self.channel_name)
		print("disconnected")
