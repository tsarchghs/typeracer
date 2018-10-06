from django.shortcuts import render

# Create your views here.

def typeRacer(request,race_id):
	return render(request,"typeRacer.html",{"race_id":race_id})