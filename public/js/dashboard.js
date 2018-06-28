console.log('dashboard script.');
console.log(localStorage);

/* make XHR call to fetch all decks for a single user */
let decksReq = new XMLHttpRequest();
decksReq.addEventListener("load", function() {
	
	const usersDecks = JSON.parse(this.responseText); //array
	console.log("GET Request:", usersDecks);

	const decksList = document.getElementById("decks-list");

	for (let i = 0; i < usersDecks.length; i++) {

	  let userDeck = document.createElement("li");
	  let userDeckButton = document.createElement("a");
	  let userDeckIcon = document.createElement("img");
	  let userDeckLabel = document.createElement("span");

	  userDeckIcon.src = '/assets/dashboard/black_deck.png';
	  userDeckIcon.alt = '';

	  userDeck.classList.add("user-deck");
	  userDeckButton.classList.add("user-deck-button");
	  userDeckIcon.classList.add("user-deck-icon");
	  userDeckLabel.classList.add("user-deck-label");

	  userDeckButton.appendChild(userDeckLabel);
	  userDeckButton.appendChild(userDeckIcon);
	  userDeck.appendChild(userDeckButton);
	  decksList.appendChild(userDeck);	

	  userDeckLabel.innerHTML = usersDecks[i].title;

	  userDeckButton.onclick = function(e) {
	  	//XHR
	  	console.log('deck clicked.');
	  };



	}

});
decksReq.open("GET", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true);
decksReq.send();




/*For Add New Deck form*/
const newDeckForm = document.getElementById("create-deck-container");

function openForm() {
	newDeckForm.style.display = "block";
};
function closeForm() {
	newDeckForm.style.display = "none";
};

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

/*For Delete Decks*/
function deleteDecks() {
	console.log('deleting decks.');
};

/*For Edit Decks*/
function editDecks() {
	alert('Edit Decks feature coming soon!');
};
