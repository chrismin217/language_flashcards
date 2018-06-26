console.log('dashboard script.');

/* make XHR call to fetch all decks for a single user */
/* decks div will show all decks..user can then POST/PUT/DEL */

let decksReq = new XMLHttpRequest();
decksReq.addEventListener("load", function() {
	console.log(this.responseText);
});
decksReq.open("GET", "http://127.0.0.1:8080/api/cards/");
decksReq.send();

/* popup form for new decks */
const newDeckForm = document.getElementById("create-deck-container");
const createDeckBtn = document.getElementById("create-button").addEventListener("click", function() {
	console.log('popup form for new deck.');
	newDeckForm.style.display = "block";
});