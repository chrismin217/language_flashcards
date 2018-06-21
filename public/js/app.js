console.log(localStorage);

let options = {
  timeConstraint : 0.25,
  targetLangRatio : 0,
  gridHasCards : false,
  gridRows : 2,
  gridCols : 2,
  totalCards : null
};

/*FUNCTIONALITY FOR TIME CONSTRAINT BOX*/
const currentTime = document.getElementById('current-time');
currentTime.innerHTML = options.timeConstraint + ' sec';

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
const ratioVal = document.getElementById('ratio-val');
ratioVal.innerHTML = options.targetLangRatio + "%";

const ratio = document.getElementById('ratio').addEventListener("input", function() {
  ratioVal.innerHTML = this.value + "%";
  options.targetLangRatio = this.value / 100;
});

/*FUNCTIONALITY FOR RENDERING CARDS ON GRID*/
const grid = document.getElementById('grid');
const generate = document.getElementById('generate');
const rows = document.getElementById('toggle-rows');
const cols = document.getElementById('toggle-cols');

let rowUp = document.getElementById('row-up').addEventListener("click", function() {
  if (rows.value < 6) {
    options.gridRows = options.gridRows + 1;
    rows.value = options.gridRows;
  } else {
    alert('Rows cannot exceed 6.');
  };
});
let rowDown = document.getElementById('row-down').addEventListener("click", function() {
  if (rows.value > 2) {
    options.gridRows = options.gridRows - 1;
    rows.value = options.gridRows;
  } else {
    alert('Must have at least 2 rows.');
  };
});

let colsUp = document.getElementById('col-up').addEventListener("click", function() {

  if (cols.value < 6) {
    options.gridCols = options.gridCols + 1;
    cols.value = options.gridCols;
  } else {
    alert('Columns cannot exceed 6.');
  }

});
let colsDown = document.getElementById('col-down').addEventListener("click", function() {

  if (cols.value > 2) {
    options.gridCols = options.gridCols - 1;
    cols.value = options.gridCols;
  } else {
    alert('Must have at least 2 columns.');
  }

});

/*Main render function.. can re-factor big time with the styling.*/
function renderGrid() {

  if (options.gridHasCards) {
    grid.innerHTML = '';
  } 

  options.totalCards = options.gridRows * options.gridCols;

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

        let centerContent = {
          position : 'absolute',
          left : "50%",
          top : "50%",
          transform : "translate(-50%, -50%)"
        };

        let frontContent = document.createElement("span");
        frontContent.innerHTML = cardFront.question;
        cardFront.appendChild(frontContent);

        let backContent = document.createElement("span");
        backContent.innerHTML = cardBack.answer;
        cardBack.appendChild(backContent);
        
        for (x in centerContent) {
          frontContent.style[x] = centerContent[x];
          backContent.style[x] = centerContent[x];
        }


        
      });
      cardsReq.open("GET", "http://127.0.0.1:8080/api/cards");
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


/*FUNCTIONALITY FOR RESET DEFAULTS BUTTON*/
const reset = document.getElementById("reset").addEventListener("click", function() {

  let defaults = {
    timeConstraint : 0.25,
    targetLangRatio : 0,
    gridRows : 2,
    gridCols : 2
  };

  let resetOptions = Object.assign(options, defaults);

  //slider goes back to left-most starting point
  const ratio = document.getElementById("ratio");
  ratio.value = 0;

  currentTime.innerHTML = resetOptions.timeConstraint + ' sec';
  ratioVal.innerHTML = resetOptions.targetLangRatio + "%";
  rows.value = resetOptions.gridRows;
  cols.value = resetOptions.gridCols;
});

