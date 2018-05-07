const grid = document.getElementById('grid');
const options = document.getElementById('options');
const generate = document.getElementById('generate');
let gridSize = document.getElementById('gridsize').value;

function Card(question, answer) {
  this.question = question;
  this.answer = answer;
};

/*  The grid is a 600 * 600 px box  */
function render() {

  console.log('render function');
  console.log(gridSize);

  let width = 600 / gridSize;
  let height = 600 / gridSize;

  for (let i = 0; i < gridSize; i++) {

  	var flashCard = new Card('English', 'Korean');

    let cardContainer = document.createElement("div");
    cardContainer.style.width = width;
    cardContainer.style.height = height;
    cardContainer.style.border = "1px solid black";

    cardContainer.appendChild(flashCard);
  	grid.appendChild(cardContainer);

  }
  

};

generate.addEventListener("click", render);


