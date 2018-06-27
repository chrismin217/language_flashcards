console.log('dashboard script.');
console.log(localStorage);

/* make XHR call to fetch all decks for a single user */
/* decks div will show all decks..user can then POST/PUT/DEL */
let decksReq = new XMLHttpRequest();
decksReq.addEventListener("load", function() {
	
	const usersDecks = JSON.parse(this.responseText); //array
	console.log("GET Request:", usersDecks);

	const decksList = document.getElementById("decks-list");

	for (let i = 0; i < usersDecks.length; i++) {
	  let userDeck = document.createElement("li");
	  let userDeckButton = document.createElement("a");

	  userDeck.classList.add("user-deck");
	  userDeckButton.classList.add("user-deck-button");
	  userDeckButton.href = "#";
	  userDeckButton.innerHTML = usersDecks[i].title;

	  userDeck.appendChild(userDeckButton);
	  decksList.appendChild(userDeck);	
	}

});
decksReq.open("GET", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true);
decksReq.send();



/* popup form for new decks */
const newDeckForm = document.getElementById("create-deck-container");

function openForm() {
	newDeckForm.style.display = "block";
};
function closeForm() {
	newDeckForm.style.display = "none";
};

/*For Add New Deck form*/
function deckSubmit(formElement) {

	let title = formElement.title.value;
	let native = formElement.native.value;
	let target = formElement.target.value;

	let newDeckReq = new XMLHttpRequest();

	newDeckReq.addEventListener("load", function(e) {
		window.location.reload();
		return false;
	});

	newDeckReq.open("POST", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true);
	newDeckReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	newDeckReq.send("title=" + title + "&native=" + native + "&target=" + target);

	return false;

};
