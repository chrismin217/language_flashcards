/*FOR LATER.. will try and put things into one object*/
let options = {
  timeConstraint : 0.25,
  targetLangRatio : null,
  gridHasCards : false,
  gridRows : null,
  gridCols : null,
  totalCards : null
};

/*FUNCTIONALITY FOR TIME CONSTRAINT BOX*/
const currentTime = document.getElementById('current-time');
currentTime.innerHTML = options.timeConstraint;

const plus = document.getElementById('toggle-plus').addEventListener("click", function() {
  if (options.timeConstraint < 3) {
    options.timeConstraint += 0.25;
    currentTime.innerHTML = options.timeConstraint + ' sec';
  } 
});
const minus = document.getElementById('toggle-minus').addEventListener("click", function() {
  if (options.timeConstraint > 0.25) {
    options.timeConstraint -= 0.25;
    currentTime.innerHTML = options.timeConstraint + ' sec';
  }
});;

/*FUNCTIONALITY FOR TARGET LANG RATIO BOX*/
const ratio = document.getElementById('ratio').addEventListener("input", function() {
  const ratioVal = document.getElementById('ratio-val');
  ratioVal.innerHTML = this.value + "%";
  options.targetLangRatio = this.value / 100;
});

/*FUNCTIONALITY FOR RENDERING CARDS ON GRID*/
const grid = document.getElementById('grid');
const generate = document.getElementById('generate');
let rows = document.getElementById('toggle-rows').addEventListener("click", function() {
  options.gridRows = parseInt(this.value);
});
let cols = document.getElementById('toggle-cols').addEventListener("click", function() {
  options.gridCols = parseInt(this.value);
});

function renderGrid() {

  if (options.gridHasCards) {
    grid.innerHTML = '';
  } 

  options.totalCards = options.gridRows * options.gridCols;

  /*important for rendering*/
  let totalTarget = Math.round(options.gridCards * options.targetLangRatio);
  let totalNative = Math.floor(options.gridCards - totalTarget);
      
  /*Loop for rows*/
  for (let i = 0; i < options.gridRows; i++) {

    let rowContainer = document.createElement("div");
    let h = 100 / options.gridRows; 

    rowContainer.style.position = "relative";
    rowContainer.style.display = "block";
    rowContainer.style.height = h + "%";
    
    grid.appendChild(rowContainer);

    /*Loop for columns*/
    for (let j = 0; j < options.gridCols; j++) {

      let cardContainer = document.createElement("div");
      cardContainer.classList.add("card-container");
      cardContainer.style.width = 100 / options.gridCols + "%";
      
      let flashCard = document.createElement("div");
      let cardFront = document.createElement("div");
      let cardBack = document.createElement("div");
      let cardContent = document.createElement("span");

      flashCard.classList.add("flashcard");
      cardFront.classList.add("card-face", "card-front");
      cardBack.classList.add("card-face", "card-back");
      
      flashCard.appendChild(cardFront);
      flashCard.appendChild(cardBack);
      cardContainer.appendChild(flashCard);

      var cardsReq = new XMLHttpRequest();
      cardsReq.addEventListener("load", function() {

        let randomCard = JSON.parse(this.responseText);
        let { answer, question } = randomCard;

        //if either target or native has run out of cards, unconditionally render whichever has cards
        if (totalTarget == 0 || totalNative == 0) {
    
          if (totalTarget == 0) {
            cardFront.question = question;
            cardBack.answer = answer;
            totalNative -= 1;
          } else {
            cardFront.question = answer;
            cardBack.answer = question;
            totalTarget -= 1; 
          }

        } else {
          //otherwise, use a random dice roll to determine the render
          let diceRoll = Math.random();
          if (diceRoll < options.targetLangRatio) {
            cardFront.question = answer;
            cardBack.answer = question;
            totalTarget -= 1;       
          } else {
            cardFront.question = question;
            cardBack.answer = answer;
            totalNative -= 1;
          }
        }

        /*since I want vertical centering, don't use innerHTML*/
        cardFront.innerHTML = cardFront.question;
        cardBack.innerHTML = cardBack.answer;
        
      });
      cardsReq.open("GET", "http://127.0.0.1:3000/api/cards");
      cardsReq.send();

      flashCard.addEventListener("click", function() {

        this.classList.toggle("is-flipped");

        setTimeout(() => {
        	this.classList.toggle("is-flipped");
        }, options.timeConstraint * 1000 + 500); //+500 accounts for the 0.5 transition time

      });

      rowContainer.appendChild(cardContainer);

    }

  }

  options.gridHasCards = true;
    
};

generate.addEventListener("click", renderGrid);

