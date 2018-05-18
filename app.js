/*FUNCTIONALITY FOR RENDERING CARDS ON GRID*/
const grid = document.getElementById('grid');
grid.hasCards = false;

const generate = document.getElementById('generate');

function renderGrid() {

  if (grid.hasCards) {
    grid.innerHTML = '';
  } 

  let rows = document.getElementById('toggle-rows').value;
  let cols = document.getElementById('toggle-cols').value;

  for (let i = 0; i < rows; i++) {

    let rowContainer = document.createElement("div");
    let h = 100 / rows; 

    rowContainer.style.position = "relative";
    rowContainer.style.display = "block";
    rowContainer.style.height = h + "%";
    
    grid.appendChild(rowContainer);

    for (let j = 0; j < cols; j++) {

      let cardContainer = document.createElement("div");

      cardContainer.style.width = 100 / cols + "%";
      cardContainer.style.height = "100%";
      cardContainer.style.border = "1px solid cyan";
      cardContainer.style.float = 'left';
     
     /*Grab a flashcard from the fake server*/
      var cardsReq = new XMLHttpRequest();
      cardsReq.addEventListener("load", function() {
        let randomCard = JSON.parse(this.responseText);
        cardContainer.question = randomCard.question;
        cardContainer.answer = randomCard.answer;
        cardContainer.innerHTML = randomCard.question;
      });
      cardsReq.open("GET", "http://127.0.0.1:3000/api/cards");
      cardsReq.send();

      /*Basic pseudo flip functionality for now through event listener*/
      cardContainer.addEventListener("click", function() {

        this.innerHTML = cardContainer.answer;
        let timeDifficulty = document.getElementById('time').value;

        setTimeout(() => {
        	this.innerHTML = cardContainer.question; 
        }, timeDifficulty * 1000);

      });

      rowContainer.appendChild(cardContainer);

    }

  }

  grid.hasCards = true;
    
};

generate.addEventListener("click", renderGrid);

/*FUNCTIONALITY FOR TIME CONSTRAINT BOX*/
const currentTime = document.getElementById('current-time');
let timeConstraint = 0.25;

currentTime.innerHTML = timeConstraint + ' sec';

const plus = document.getElementById('toggle-plus').addEventListener("click", function() {

  if (timeConstraint < 3) {
    timeConstraint += 0.25;
    currentTime.innerHTML = timeConstraint + ' sec';
  } 
  
});

const minus = document.getElementById('toggle-minus').addEventListener("click", function() {
  
  if (timeConstraint > 0.25) {
    timeConstraint -= 0.25;
    currentTime.innerHTML = timeConstraint + ' sec';
  }

});;

/*FUNCTIONALITY FOR RATIO BOX*/

const ratio = document.getElementById('ratio').addEventListener("input", function() {
  const ratioVal = document.getElementById('ratio-val');
  ratioVal.innerHTML = this.value + "%";
});