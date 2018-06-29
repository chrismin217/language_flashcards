console.log(localStorage);
console.log('dashboard script.');

let selectedDeck = {};

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

	  userDeckIcon.deckData = deckData;

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
	  	Object.assign(selectedDeck, this.deckData); 
	  	console.log(selectedDeck);

	  	let cardsLabel = document.getElementById("cards-label").innerHTML = selectedDeck.title;
	  	let cardsList = document.getElementById("cards-list");
	  	cardsList.innerHTML = '';
	  	
	  	let singleDeckCardsReq = new XMLHttpRequest();
	  	singleDeckCardsReq.addEventListener("load", function(e) {
	  		
	  		console.log("GET single deck cards request.");

	  		let usersCards = JSON.parse(this.responseText);

	  		//for loop populate cardsList
	  		for (let i = 0; i < usersCards.length; i++) {

	  			let cardData = usersCards[i];
	  			console.log(cardData.question, cardData.answer);

	  			let userCard = document.createElement("li");
		  		let userCardButton = document.createElement("a");
		  		let userCardIcon = document.createElement("img");
		  		let userCardLabel = document.createElement("span");

		  		userCardIcon.alt = '';
		  		userCardIcon.src = '/assets/dashboard/index_card_icon.png';

		  		userCardLabel.innerHTML = cardData.question;

		  		userCard.classList.add("user-card");
			    userCardButton.classList.add("user-card-button");
			    userCardIcon.classList.add("user-card-icon");
			    userCardLabel.classList.add("user-card-label");

			    userCardButton.appendChild(userCardLabel);
			    userCardButton.appendChild(userCardIcon);
			    userCard.appendChild(userCardButton);
			    cardsList.appendChild(userCard);

		  		userCardIcon.onClick = function(e) {
		  			console.log('card clicked.');
		  			console.log(this);
		  		};

	  		}//end for


	  	});
	  	singleDeckCardsReq.open("GET", "http://127.0.0.1:8080/api/cards/" + selectedDeck.id, true); //cards belonging to a deck ID
	  	singleDeckCardsReq.send();

	  };

	}//end for


});
decksReq.open("GET", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true); //decks belonging to a user ID
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

	console.log('card submit.');

	let question = formElement.question.value;
	let answer = formElement.answer.value;
	console.log(question, answer);

	let newCardReq = new XMLHttpRequest();
	newCardReq.addEventListener("load", function() {
		let response = JSON.parse(this.responseText);
		console.log(response);
		alert(response);
		window.location.reload();
		return false;
	});
	newCardReq.open("POST", "http://127.0.0.1:8080/api/cards/" + selectedDeck.id, true);
	newCardReq.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	newCardReq.send("question=" + question + "&answer=" + answer);

	return false;

};

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


