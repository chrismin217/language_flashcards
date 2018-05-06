const grid = document.getElementById('grid');
const options = document.getElementById('options');
const generate = document.getElementById('generate');

function Card(question, answer) {
  this.question = question;
  this.answer = answer;
};

function render(cols, rows) {

  let num = cols * rows;

  for (let i = 0; i < num; i++) {
  	var flashCard = new Card('English', 'Korean');
    let cardContainer = document.createElement("div");
    cardContainer.appendChild(flashCard);
  	grid.appendChild(cardContainer);
  }
  

};

generate.addEventListener("click", render);


