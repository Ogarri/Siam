console.log("vue chargée");

//bite

const nb_ligne = 7;
const nb_col = 5;   

document.addEventListener('DOMContentLoaded', function() {

  const plateau = document.getElementById('plateau');
  const casesContainer = document.getElementById('cases-container');

  plateau.style.backgroundImage = `url('assets/plateau.png')`;

  for (let i = 0; i < nb_ligne; i++) {
      for (let j = 0; j < nb_col; j++) {
          const caseElement = document.createElement('div');
          caseElement.classList.add('case');
          caseElement.id = `case-${i}-${j}`;
          casesContainer.append(caseElement);
      }
  }

  for (let x = 0; x < nb_col; x++) {
    var x_case = document.getElementById(`case-0-${x}`);
    x_case.style.backgroundImage = `url('assets/Rouge${x}.png')`;
    x_case.style.transform = 'rotate(180deg)';
  }
  for (let y = 0; y < nb_col; y++) {
    var y_case = document.getElementById(`case-6-${y}`);
    y_case.style.backgroundImage = `url('assets/Bleu${y}.png')`;
  }

  for (let i = 1; i < 4; i++) {
    var k = aleatoire(1, 4);
    var caillou_case = document.getElementById(`case-3-${i}`);
    caillou_case.style.backgroundImage = `url('assets/Caillou${k}.png')`;
  }
});

function aleatoire (a, b) {
  return Math.round(Math.random() * (b - a) + a)
}