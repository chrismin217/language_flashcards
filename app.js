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



/*FUNCTIONALITY FOR TARGET LANG RATIO BOX*/
const ratio = document.getElementById('ratio').addEventListener("input", function() {
  const ratioVal = document.getElementById('ratio-val');
  ratioVal.innerHTML = this.value + "%";
});


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

  let totalCards = rows * cols;

  let targetLangRatio = parseInt(document.getElementById('ratio').value) / 100;

  let totalTarget = Math.round(totalCards * targetLangRatio);
  let totalNative = Math.floor(totalCards - totalTarget);
      
  /*Loop for rows*/
  for (let i = 0; i < rows; i++) {

    let rowContainer = document.createElement("div");
    let h = 100 / rows; 

    rowContainer.style.position = "relative";
    rowContainer.style.display = "block";
    rowContainer.style.height = h + "%";
    
    grid.appendChild(rowContainer);

    /*Loop for columns*/
    for (let j = 0; j < cols; j++) {

      let cardContainer = document.createElement("div");

      cardContainer.style.width = 100 / cols + "%";
      cardContainer.style.height = "100%";
      cardContainer.style.border = "1px solid cyan";
      cardContainer.style.float = 'left';
     
      var cardsReq = new XMLHttpRequest();
      cardsReq.addEventListener("load", function() {

        let randomCard = JSON.parse(this.responseText);
        let { answer, question } = randomCard;

        //if either target or native has run out of cards, unconditionally render whichever has cards
        if (totalTarget == 0 || totalNative == 0) {
    
          if (totalTarget == 0) {
            cardContainer.question = question;
            cardContainer.answer = answer;
            totalNative -= 1;
          } else {
            cardContainer.question = answer;
            cardContainer.answer = question;
            totalTarget -= 1; 
          }

        } else {
          //otherwise, use a random dice roll to determine the render
          let diceRoll = Math.random();
          if (diceRoll < targetLangRatio) {
            cardContainer.question = answer;
            cardContainer.answer = question;
            totalTarget -= 1;       
          } else {
            cardContainer.question = question;
            cardContainer.answer = answer;
            totalNative -= 1;
          }
        }

        cardContainer.innerHTML = cardContainer.question;
        
      });
      cardsReq.open("GET", "http://127.0.0.1:3000/api/cards");
      cardsReq.send();

      /*Basic pseudo flip functionality for now through event listener*/
      cardContainer.addEventListener("click", function() {

        this.innerHTML = cardContainer.answer;

        setTimeout(() => {
        	this.innerHTML = cardContainer.question; 
        }, timeConstraint * 1000);

      });

      rowContainer.appendChild(cardContainer);

    }

  }

  grid.hasCards = true;
    
};

generate.addEventListener("click", renderGrid);

