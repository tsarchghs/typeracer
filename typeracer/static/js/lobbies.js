
var race_id = document.getElementById("race_id").value;
var TypeRacerWebSocket = new WebSocket(`ws://localhost:8000/ws/TypeRacer/${race_id}/`);

function addLobby(id){
	ul = document.getElementById("lobbies_ul");
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
	if ("connected_to_lobby" in json) {
		addLobby(json["race_id"]);
	} else if ("message" in json){
		message = json["message"];
		if ("connected_to_lobby" in message) {
			addLobby(message["race_id"]);
		}
	}
}