
var name = "Anonymous#" + Math.floor((Math.random()*1000)+1);
var race_id = document.getElementById("race_id").value;
console.log(TypeRacerWebSocket);
var TypeRacerWebSocket = new WebSocket(`ws://localhost:8000/ws/TypeRacer/${race_id}/`);

function count_green_chars(word) {
	var n = 0
	for (var char_color in word) {
		if (word[char_color][1] === "green") {
			n++
		}
	}
	return n;
}
var random_text = "blabla abc dsa";
var text_characters = Array.from(random_text);
var text = [];
var current_char_index = 0
for (var char in text_characters){
	text.push([text_characters[char],"black"]);
}
var type_text = document.getElementById("type_text");
function update_text() {
	type_text.innerHTML = "";
	for (var text_color in text) {
		var p = document.createElement("p");
		p.style = `display:inline;color:${text[text_color][1]}`
		p.innerHTML = text[text_color][0];
		type_text.appendChild(p);
	}
}
function addPlayer(chars,player_name=""){
	players_div = document.getElementById("players");
	if (!player_name){
		player_name = name;
	}
	player_div = document.createElement("div")
	player_div.id = player_name;
	player_h2 = document.createElement("h2")
	player_h2.id = `${player_name}_h2`
	if (chars){
		player_h2.innerHTML = `${player_name} - ${count_green_chars(chars)}-${chars.length}`;
	} else {
		player_h2.innerHTML = `${player_name} - 0-${text.length}`;
	}
	player_div.appendChild(player_h2);
	players_div.appendChild(player_div);
}

TypeRacerWebSocket.onmessage = function(event){
	json = JSON.parse(event["data"]);
	message = json["message"];
	if ("send_player_info" in json){
	}
	else if ("connected_to_lobby" in json){
		TypeRacerWebSocket.send(JSON.stringify({"connected_to_lobby":true,"race_id":"1"}));
		TypeRacerWebSocket.send(JSON.stringify({"send_player_info":true}));
	}
	if (message && "add_player" in message) {
		if (!document.getElementById(message["player_name"])){
			console.log(message);
			addPlayer("",message["player_name"]);
		}
	} else if (json["Connected"]){
		player_name = name;
		if (player_name){
			TypeRacerWebSocket.send(JSON.stringify({"add_player":true,"player_name":player_name}))
		}
	} else if (message && !("connected_to_lobby" in message)) {
		chars = json["message"]["data"];
		player_name = json["message"]["player"];
		if (document.getElementById(player_name)) {
			document.getElementById(`${player_name}_h2`).innerHTML = `${player_name} - ${count_green_chars(chars)}-${chars.length}`;
		} else {
			addPlayer(chars,player_name);
		}
		if (player_name){
			TypeRacerWebSocket.send(JSON.stringify({"add_player":true,"player_name":player_name}))
		}
	}
}

update_text();
var text_input = document.getElementById("text_input");

document.addEventListener("keydown", (event) => {
	if (event.key == "Backspace"){
		if (text.length > current_char_index && current_char_index > 0){
			text[current_char_index-1][1] = "black";
		}
		if (current_char_index>=1){
			current_char_index--;
		}
	}
	else if (event.key == " " || event.key == "Enter"){
		if (text[current_char_index][0] === " "){
			text_input.value = "";
			text[current_char_index][1] = "green";
			current_char_index++;
		} else {
			text[current_char_index][1] = "red";
			current_char_index++;			
		}
	}
	else if (current_char_index < text.length){
		if (text_input === document.activeElement){
			if (event.key === text[current_char_index][0]){
				text[current_char_index][1] = "green";
			} else {
				text[current_char_index][1] = "red";
			}
			current_char_index++;
		}
	}
	update_text();
	TypeRacerWebSocket.send(JSON.stringify({"player":name,"data":text}));
})