

var TypeRacerWebSocket = new WebSocket(`ws://localhost:8000/ws/TypeRacer/all/`);


function addRace(id){
	ul = document.getElementById("races_ul");
	if (!document.getElementById(id)){
		lobby_li = document.createElement("li");
		lobby_li.id = id;
		lobby_li.innerHTML = `#${id} - 1`;
		ul.appendChild(lobby_li);
	} else {
		lobby_li = document.getElementById(id)
		lobby_li.innerHTML = `#${id} - ${Number(lobby_li.innerHTML.split(" ")[2])+1}`;
	}
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
	}
	if ("connected_to_lobby" in json) {
		addRace(json["race_id"]);
	} else if ("message" in json){
		message = json["message"];
		if ("connected_to_lobby" in message) {
			addRace(message["race_id"]);
		}
	}
}