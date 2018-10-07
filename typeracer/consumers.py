from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from .models import Race,Player
import json

class TypeRacerConsumer(WebsocketConsumer):
	def connect(self):
		self.race_id = self.scope['url_route']['kwargs']['race_id']
		self.accept()
		async_to_sync(self.channel_layer.group_add)(
			self.race_id,
			self.channel_name
			)
		if self.race_id != "all":
			self.race = Race.objects.get(pk=self.race_id)
			async_to_sync(self.channel_layer.group_send)(
				self.race_id,
				{
					"type":"shareEvent",
					"message":{"send_player_info":True}
				}
			)
	def receive(self,text_data):
		text_data_json = json.loads(text_data)
		print(text_data_json)
		if "update_race" in text_data_json:
			async_to_sync(self.channel_layer.group_send)(
				"all",
				{
					"type":"shareEvent",
					"message":text_data_json
				})
		else:	
			if "remove_player" in text_data_json:
				Player.objects.filter(pk=text_data_json["player_id"]).delete()
			if "update" in text_data_json:
					player = Player.objects.get(player_id=int(text_data_json["player_name"].split("#")[1]))
					player.characters_typed = text_data_json["green_chars"]
					player.save()
			if "create_player" in text_data_json:
				player_id = text_data_json["player_id"]
				text_length = text_data_json["text_length"]
				self.player = Player.objects.create(race=self.race,
													player_id=player_id,
													characters_typed=0,
													text_length=text_length)
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
