/*FUNCTIONALITY FOR RENDERING CARDS ON GRID*/
const grid = document.getElementById('grid');
grid.hasCards = false;

const generate = document.getElementById('generate');

function renderGrid() {

  if (grid.hasCards) {
    grid.innerHTML = '';
  } 

  let gridSize = document.getElementById('gridsize').value;
  let wh = 100 / gridSize;

  for (let i = 0; i < gridSize * gridSize; i++) {
    
    let cardContainer = document.createElement("div");

    cardContainer.style.width = wh - 5 + '%';
    cardContainer.style.height = wh - 5 + '%';
    cardContainer.style.border = "1px solid cyan";
    cardContainer.style.margin = '2.5%';
    cardContainer.style.float = 'left';
   
    var cardsReq = new XMLHttpRequest();
    cardsReq.addEventListener("load", function() {
      let randomCard = JSON.parse(this.responseText);
      cardContainer.question = randomCard.question;
      cardContainer.answer = randomCard.answer;
      cardContainer.innerHTML = randomCard.question;
    });
    cardsReq.open("GET", "http://127.0.0.1:3000/api/cards");
    cardsReq.send();

    cardContainer.addEventListener("click", function() {

      this.innerHTML = cardContainer.answer;
      let timeDifficulty = document.getElementById('time').value;

      setTimeout(() => {
      	this.innerHTML = cardContainer.question; 
      }, timeDifficulty * 1000);

    });

    grid.appendChild(cardContainer);

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