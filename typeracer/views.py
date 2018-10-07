from django.shortcuts import render,redirect
from .models import Race,Player
# Create your views here.

def races(request):
	race_players = {}
	races = Race.objects.all()
	players = Player.objects.all()
	for player in players:
		if player.race in race_players:
			race_players[player.race].append(player)
		else:
			race_players[player.race] = [player]
	context = {"race_players":race_players}
	return render(request,"races.html",context)

def typeRacer(request,race_id):
	race = Race.objects.filter(pk=int(race_id))
	if not race:
		race = Race.objects.create(status="open")
	else:
		race = race[0]
	players = Player.objects.filter(race=race)
	if len(players) < race.max_players:
		context = {"race":race,"players":players}
		return render(request,"typeRacer.html",context)
	else:
		return redirect("/")