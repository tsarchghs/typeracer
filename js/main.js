
var random_text = "blabla abc";
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
update_text();
var text_input = document.getElementById("text_input");

document.addEventListener("keyup", (event) => {
	if (event.key == "Backspace"){
		text[current_char_index-1][1] = "black";
		if (current_char_index>1){
			current_char_index--;
		}
	}
	else if (event.key == " "){
		text_input.value = "";
		current_char_index++;
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
})