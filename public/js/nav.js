/*SCRIPT FOR TOP-RIGHT HAND CORNER NAV BAR ON MAIN PAGE*/

console.log(localStorage);
console.log('Nav script.');

/*Display successful sign-in message for 3 seconds*/
const loginSuccessMessage = document.getElementById("home-login");
const upArrow = document.getElementById("up-arrow");
const msg = document.getElementById("msg");
const msgText = document.getElementById("msg-text");

if (localStorage.username) {

	loginSuccessMessage.style.display = "block";
	upArrow.style.display = "block";
	msg.style.display = "block";
	msgText.innerHTML = "Welcome " + localStorage.username + "!";

    setTimeout(() => {
      loginSuccessMessage.style.display = "none";
    }, 4000);

}

/*Change navbar and deck box based on localStorage*/
const loggedIn = document.getElementById("loggedIn");
const loggedOut = document.getElementById("loggedOut");
const deckBox = document.getElementById("deck-box");

if (localStorage.username) {
  loggedOut.style.display = "none";
  deckBox.style.display = "block";
} else {
  loggedIn.style.display = "none";
}

/*User logout*/
function logout() {
  localStorage.clear();
  window.location = "/";
}

/*User Deck Box near grid*/
let decksReq = new XMLHttpRequest();
decksReq.addEventListener("load", function() {

  console.log('deck box request.');

  let deckBoxItems = JSON.parse(this.responseText);
  let deckBoxLabel = document.getElementById("deck-box-label");
  deckBoxLabel.innerHTML = "My Decks";

  let deckBoxList = document.getElementById("deck-box-list");

  //populate deck-box-list
  for (let i = 0; i < deckBoxItems.length; i++) {
    
    let deckData = deckBoxItems[i];

    let boxDeck = document.createElement("li");
    let boxDeckButton = document.createElement("a");
    let boxDeckIcon = document.createElement("img");
    let boxDeckLabel = document.createElement("span");

    boxDeckIcon.src = '/assets/dashboard/box_deck.png';
    boxDeckIcon.alt = '';

    boxDeckLabel.innerHTML = deckData.title;

    boxDeck.classList.add('box-deck');
    boxDeckButton.classList.add('box-deck-button');
    boxDeckIcon.classList.add('box-deck-icon');
    boxDeckLabel.classList.add('box-deck-label');

    boxDeckButton.appendChild(boxDeckLabel);
    boxDeckButton.appendChild(boxDeckIcon);
    boxDeck.appendChild(boxDeckButton);

    deckBoxList.appendChild(boxDeck);

    boxDeckIcon.onclick = function(e) {
      console.log('deck box deck clicked.');
    };

  }//end for


});
decksReq.open("GET", "http://127.0.0.1:8080/api/decks/" + localStorage.id, true);
decksReq.send();