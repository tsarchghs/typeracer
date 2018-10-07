

var TypeRacerWebSocket = new WebSocket(`ws://localhost:8000/ws/TypeRacer/all/`);

function addRaceLi(id,current_players=0,max_players=0,status="open"){
	console.log(current_players,max_players,status);
	ul = document.getElementById("races_ul");
	if (!document.getElementById(id)){
		lobby_li = document.createElement("li");
		lobby_li.id = id;
		lobby_li.innerHTML = `#${id} - `
		p = document.createElement("p");
		p.id = `${id}_players`;
		p.style = "display:inline;"
		p.innerHTML = `${current_players}/${max_players}`
		lobby_li.appendChild(p);
		lobby_li.innerHTML += ` (${status})`;
		ul.appendChild(lobby_li);
		a = document.createElement("a")
		a.href = `/play/${id}`
		button = document.createElement("button");
		button.innerHTML = "Join";
		a.appendChild(button);
		ul.appendChild(a);
	}
}

function createRace(){
	var csrftoken = Cookies.get('csrftoken');
	max_players = prompt("max_players: ");
	while (!(max_players==Number(max_players))){
		max_players = prompt("Please enter a number!\nmax_players: ");
	}
	$.ajax({
		type:"POST",
		data: {"csrfmiddlewaretoken":csrftoken,
				"max_players":Number(max_players)},
		url:"/create_race"
	}).done(function(json){
		race_id = json[0]["pk"];
		race = json[0]["fields"];
		TypeRacerWebSocket.send(JSON.stringify({"add_race":true,"race_id":race_id,"status":race["status"],
												"max_players":race["max_players"]}));
	})
}
TypeRacerWebSocket.onmessage = function(event) {
	json = JSON.parse(event.data);
	console.log(json);
	message = json["message"]
	if (message && "update_race" in message){
		race_players  = document.getElementById(`${message["race_id"]}_players`);
		console.log(race_players);
		current_players = String(Number(race_players.innerHTML.split("/")[0]) + 1);
		max_players = race_players.innerHTML.split("/")[1];
		race_players.innerHTML = `${current_players}/${max_players}`;
	} else if (message && "add_race" in message){
		console.log(message);
		addRaceLi(message["race_id"],0,message["max_players"],message["status"]);
	}
}