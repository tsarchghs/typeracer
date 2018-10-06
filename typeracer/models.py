from django.db import models

class Race(models.Model):
	choices = (("open","open"),("closed","closed"),)
	status = models.CharField(max_length=6,choices=choices)
	max_players = models.IntegerField()

class Player(models.Model):
	race = models.ForeignKey(Race,on_delete=models.CASCADE)
	player_id = models.IntegerField()
	characters_typed = models.IntegerField()
	text_length = models.IntegerField()
	def __str__(self):
		return "Player-{}".format(self.player_id)