console.log(localStorage);
console.log('dashboard script.');

/*this is for PUT/DEL later..*/
let deckSelected = false;

/* GET request for all decks belonging to a user */
let decksReq = new XMLHttpRequest();
decksReq.addEventListener("load", function() {
	
	const usersDecks = JSON.parse(this.responseText);

	const decksList = document.getElementById("decks-list");

	for (let i = 0; i < usersDecks.length; i++) {

	  let deckData = usersDecks[i];

	  let userDeck = document.createElement("li");
	  let userDeckButton = document.createElement("a");
	  let userDeckIcon = document.createElement("img");
	  let userDeckLabel = document.createElement("span");

	  userDeckIcon.title = deckData.title;
	  userDeckIcon.id = deckData.id;
	  userDeckIcon.user_id = deckData.user_id;

	  /*userDeckIcon.draggable = "true";*/
	  userDeckIcon.src = '/assets/dashboard/black_deck.png';
	  userDeckIcon.alt = '';

	  userDeckLabel.innerHTML = deckData.title;

	  userDeck.classList.add("user-deck");
	  userDeckButton.classList.add("user-deck-button");
	  userDeckIcon.classList.add("user-deck-icon");
	  userDeckLabel.classList.add("user-deck-label");

	  userDeckButton.appendChild(userDeckLabel);
	  userDeckButton.appendChild(userDeckIcon);
	  userDeck.appendChild(userDeckButton);
	  decksList.appendChild(userDeck);	

	  //XHR request going to /api/cards
	  userDeckIcon.onclick = function(e) {

	  	console.log('deck clicked.');
	  	console.log(this.title, this.id, this.user_id);

	  	let that = this;

	  	let singleDeckReq = new XMLHttpRequest();
	  	singleDeckReq.addEventListener("load", function(e) {
	  		
	  		console.log("GET single deck request.");
	  		let usersCards = JSON.parse(this.responseText);

	  		//call cardSubmit here

	  	});
	  	singleDeckReq.open("GET", "http://127.0.0.1:8080/api/cards/" + that.id, true);
	  	singleDeckReq.send();

	  };

	}//end for


});
decksReq.open("GET", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true);
decksReq.send();

/*POST*/
/*Decks*/
const newDeckForm = document.getElementById("create-deck-container");

function openDeckForm() {
	newDeckForm.style.display = "block";
};
function closeDeckForm() {
	newDeckForm.style.display = "none";
};

function deckSubmit(formElement) {

	let title = formElement.title.value;
	let native = formElement.native.value;
	let target = formElement.target.value;

	let newDeckReq = new XMLHttpRequest();

	newDeckReq.addEventListener("load", function(e) {

		let response = this.responseText;

		if (response.includes("Conflict.")) {
		  alert("Cannot exceed 24 decks.");
		} 
		window.location.reload();

		return false;

	});

	newDeckReq.open("POST", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true);
	newDeckReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	newDeckReq.send("title=" + title + "&native=" + native + "&target=" + target);

	return false;

};

/*Cards*/
const newCardForm = document.getElementById("create-card-container");

function openCardForm() {
	newCardForm.style.display = "block";
};
function closeCardForm() {
	newCardForm.style.display = "none";
};

function cardSubmit(formElement) {

}

/*PUT*/
function editDecks() {
	alert('Edit Decks feature coming soon!');
};

function editCards() {
	alert('Edit Cards feature coming soon!');
};

/*DELETE*/
function deleteDecks() {
	alert('Delete Decks feature coming soon!');
};

function deleteCards() {
	alert('Delete Cards feature coming soon!');
};


