from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Race,Player
import json

class TypeRacerConsumer(WebsocketConsumer):
	def connect(self):
		self.race_id = self.scope['url_route']['kwargs']['race_id']
		self.race = Race.objects.get(pk=self.race_id)
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
		text_data_json = json.loads(text_data);
		try:
			if text_data_json["create_player"]:
				player_id = text_data_json["player_id"]
				text_length = text_data_json["text_length"]

				self.player = Player.objects.create(race=self.race,
													player_id=player_id,
													characters_typed=0,
													text_length=text_length)
		except KeyError:
			print(text_data_json)
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
