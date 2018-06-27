/*User Options*/
let options = {
  timeConstraint : 0.25,
  targetLangRatio : 0,
  gridHasCards : false,
  gridRows : 2,
  gridCols : 2
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
ratioVal.innerHTML = options.targetLangRatio + "% target";

const ratio = document.getElementById('ratio').addEventListener("input", function() {
  ratioVal.innerHTML = this.value + "% target";
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
  }
});
let rowDown = document.getElementById('row-down').addEventListener("click", function() {
  if (rows.value > 2) {
    options.gridRows = options.gridRows - 1;
    rows.value = options.gridRows;
  }
});

let colsUp = document.getElementById('col-up').addEventListener("click", function() {
  if (cols.value < 6) {
    options.gridCols = options.gridCols + 1;
    cols.value = options.gridCols;
  } 
});
let colsDown = document.getElementById('col-down').addEventListener("click", function() {
  if (cols.value > 2) {
    options.gridCols = options.gridCols - 1;
    cols.value = options.gridCols;
  } 
});




function renderGrid() {

  if (options.gridHasCards) {
    clearGrid();
  } 

  let totalCards = options.gridRows * options.gridCols;
  let totalTarget = Math.round(totalCards * options.targetLangRatio);
  let totalNative = Math.floor(totalCards - totalTarget);

  let randomizeCardContent = function(front, back, question, answer) {

    console.log('randomizing card content.');

    console.log(totalCards, totalTarget, totalNative, options.targetLangRatio);
    console.log(question, answer);

    let frontContent = document.createElement("span");
    let backContent = document.createElement("span");

    let centerContent = {
      position : 'absolute',
      left : "50%",
      top : "50%",
      transform : "translate(-50%, -50%)"
    };

    for (x in centerContent) {
      frontContent.style[x] = centerContent[x];
      backContent.style[x] = centerContent[x];
    }

    //not 100% consistent with targetLangRatio....
    //by default .. question == native language and answer == target language
    if (totalTarget == 0 || totalNative == 0) {

      //if one type of card has reached 0, unconditionally create the opposite type.
      if (totalTarget == 0) {
        frontContent.innerHTML = question;
        backContent.innerHTML = answer;
        totalNative -= 1;
      } else if (totalNative == 0) {
        frontContent.innerHTML = answer;
        backContent.innerHTML = question;
        totalTarget -= 1;
      }

    } else {

      //otherwise, use a random dice roll to determine the decision.
      let diceRoll = Math.random();
      console.log(diceRoll);
      if (diceRoll < options.targetLangRatio) {
        frontContent.innerHTML = answer;
        backContent.innerHTML = question;
        totalTarget -= 1;      
      } else {
        frontContent.innerHTML = question;
        backContent.innerHTML = answer;
        totalNative -= 1;
      }

    }

    front.appendChild(frontContent);
    back.appendChild(backContent);



  };

  /*JSON array*/
  let cardsReq = new XMLHttpRequest();
  cardsReq.addEventListener("load", function() {

    let randomCards = JSON.parse(this.responseText);
    console.log(randomCards);

    let counter = totalCards - 1;

    for (let i = 0; i < options.gridRows; i++) {

      let gridRowDiv = document.createElement("div");
      let height = 100 / options.gridRows + "%"; 

      gridRowDiv.style.position = "relative";
      gridRowDiv.style.display = "block";
      gridRowDiv.style.height = height;
      
      for (let j = 0; j < options.gridCols; j++) {

        let { question, answer } = randomCards[counter];

        let width = 100 / options.gridCols + "%";

        let cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");
        cardContainer.style.width = width;

        let flashCard = document.createElement("div");
        let cardFront = document.createElement("div");
        let cardBack = document.createElement("div");

        randomizeCardContent(cardFront, cardBack, question, answer);

        flashCard.classList.add("flashcard");
        cardFront.classList.add("card-face", "card-front");
        cardBack.classList.add("card-face", "card-back");
        
        flashCard.appendChild(cardFront);
        flashCard.appendChild(cardBack);
        cardContainer.appendChild(flashCard);

        //animation
        flashCard.addEventListener("click", function() {
          this.classList.toggle("is-flipped");
          setTimeout(() => {
            this.classList.toggle("is-flipped");
          }, options.timeConstraint * 1000 + 500); //+500 accounts for the 0.5 transition time
        });

      counter = counter - 1;
      gridRowDiv.appendChild(cardContainer);

      }//end for loop cols

    grid.appendChild(gridRowDiv);

    }//end for loop rows

  }); //END eventListener

  cardsReq.open("GET", "http://127.0.0.1:8080/api/cards/" + totalCards);
  cardsReq.send();



  options.gridHasCards = true;
    
};//end renderGrid

function clearGrid() {
  grid.innerHTML = '';
};







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