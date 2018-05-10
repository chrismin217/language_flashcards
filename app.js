const grid = document.getElementById('grid');
const options = document.getElementById('options');
const generate = document.getElementById('generate');

function Card(question, answer) {
  this.question = question;
  this.answer = answer;
};


/*FUNCTIONALITY FOR RENDERING CARDS ON GRID*/
function render() {

  let gridSize = document.getElementById('gridsize').value;
  let wh = 100 / gridSize;

  for (let i = 0; i < gridSize * gridSize; i++) {

  	var flashCard = new Card('English', 'Korean');
    let cardContainer = document.createElement("div");
    
    cardContainer.style.width = wh - 5 + '%';
    cardContainer.style.height = wh - 5 + '%';
    cardContainer.style.border = "1px solid cyan";
    cardContainer.style.margin = '2.5%';
    cardContainer.style.float = 'left';
    cardContainer.innerHTML = flashCard.question;
   
    cardContainer.addEventListener("click", function() {

      this.innerHTML = flashCard.answer;
      let timeDifficulty = document.getElementById('time').value;

      setTimeout(() => {
      	this.innerHTML = flashCard.question; 
      }, timeDifficulty * 1000);

    });

    grid.appendChild(cardContainer);

  }
  

};

generate.addEventListener("click", render);

/*FUNCTIONALITY FOR RESETTING OPTIONS*/
const resetButton = document.getElementById("reset");

function resetOptions() {
  console.log(this);
};

resetButton.addEventListener("click", resetOptions);


