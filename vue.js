const nb_ligne = 7;
const nb_col = 5;   

document.addEventListener('DOMContentLoaded', function() {

  const plateau = document.getElementById('plateau');
  const casesContainer = document.getElementById('cases-container');

  plateau.style.backgroundImage = `url('assets/plateau.png')`;

  
  //Creation des cases
  for (let i = 0; i < nb_ligne; i++) {
      for (let j = 0; j < nb_col; j++) {
          const caseElement = document.createElement('div');
          caseElement.classList.add('case');
          caseElement.setAttribute('case_vide', true);
          caseElement.id = `case-${i}-${j}`;
          casesContainer.append(caseElement);
      }
  }

  //positionnement des cases rouges
  for (let x = 0; x < nb_col; x++) {
    var x_case = document.getElementById(`case-0-${x}`);
    x_case.style.backgroundImage = `url('assets/Rouge${x}.png')`;
    x_case.style.transform = 'rotate(180deg)';
    x_case.dataset.rotation = '180';
    x_case.setAttribute('couleur', 'rouge');
    x_case.setAttribute('case_vide', false);
  }

  //positionnement des cases bleues
  for (let y = 0; y < nb_col; y++) {
    var y_case = document.getElementById(`case-6-${y}`);
    y_case.style.backgroundImage = `url('assets/Bleu${y}.png')`;
    y_case.dataset.rotation = '0';
    y_case.setAttribute('couleur', 'bleu');
    y_case.setAttribute('case_vide', false);
  }

  //positionnement des cailloux
  for (let i = 1; i < 4; i++) {
    var k = aleatoire(1, 4);
    var caillou_case = document.getElementById(`case-3-${i}`);
    caillou_case.style.backgroundImage = `url('assets/Caillou${k}.png')`;
    caillou_case.setAttribute('couleur', 'caillou');
    caillou_case.setAttribute('case_vide', false);
  }

  const pions = document.getElementsByClassName('case');
  const position_mise_en_jeu = [
    [1, 0], [1, 1], [1, 3], [1, 4], [2, 0], [2, 4], 
    [3, 0], [3, 4], [4, 0], [4, 4], [5, 0], [5, 1], 
    [5, 3], [5, 4]
  ];
  const position_banc_rouge = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
  const position_banc_bleu = [[6, 0],[6, 1], [6, 2], [6, 3], [6, 4]];

  let loopStop = false;
  let compt = 0;
  let firstClickDone = false;
  let secondClickDone = false;

  if (!firstClickDone) {
  var temp_i = 0;
  for (let i = 0; i < pions.length && !loopStop; i++) {
      pions[i].addEventListener('click', (event) => {
        temp_i = i;
        firstClickDone = true;
        console.log('click 1');
        if (pions[i].getAttribute('case_vide') == 'false') {
          if (pions[i].getAttribute('couleur') == 'rouge') { 
            if (compt < 3) {
              position_mise_en_jeu.forEach(([x, y]) => {
                const caseElement = document.getElementById(`case-${x}-${y}`);
                if (caseElement) {
                  caseElement.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
                }
              });
            } else {
              position_mise_en_jeu.forEach(([x, y]) => {
                const caseElement = document.getElementById(`case-${x}-${y}`);
                if (caseElement) {
                  caseElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
                }
              });
            }
          }
        
          if (compt < 3) {
            if (pions[i].getAttribute('couleur') == 'bleu') {
            position_mise_en_jeu.forEach(([x, y]) => {
                const caseElement = document.getElementById(`case-${x}-${y}`);
                if (caseElement) {
                  caseElement.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
                }
            });
          } else {
            position_mise_en_jeu.forEach(([x, y]) => {
              const caseElement = document.getElementById(`case-${x}-${y}`);
              if (caseElement) {
                caseElement.style.backgroundColor = 'rgba(0, 0, 0, 0)';
              }
            });
          }
          }
      }
    });
  }
  } else {
let loopStop2 = false;
  for (let k = 0; k < pions.length && !loopStop2; k++) {
    pions[k].addEventListener('click', (event) => {
      console.log('click 2');
      if (pions[k].getAttribute('case_vide') == 'true') {
        let temp = pions[k].style.backgroundImage;
        pions[k].style.backgroundImage = pions[temp_i].style.backgroundImage;
        if (compt < 3) {
          pions[temp_i].style.backgroundImage = '';
        } else {
          pions[temp_i].style.backgroundImage = temp;
        }
        compt++;
        loopStop2 = true;
        loopStop = true;
      }
    })
    firstClickDone = false;
    secondClickDone = true;
  }
}
});
                
function aleatoire (a, b) {
  return Math.round(Math.random() * (b - a) + a)
}

/*
let joueurActif = "Rouge"; 
let pieceSelectionnee = null; 

function mettreEnEvidencePieces() {
    const pieces = document.querySelectorAll(`[id^="case"]`);
    pieces.forEach(piece => {
        piece.classList.remove("highlight"); 

        if ((joueurActif === "Rouge" && piece.style.backgroundImage.includes("Rouge")) ||
            (joueurActif === "Bleu" && piece.style.backgroundImage.includes("Bleu"))) {
            piece.classList.add("highlight");
        }
    });
}

function selectionnerPiece(event) {
    const piece = event.target;

    if ((joueurActif === "Rouge" && piece.style.backgroundImage.includes("Rouge")) ||
        (joueurActif === "Bleu" && piece.style.backgroundImage.includes("Bleu"))) {
        
        if (pieceSelectionnee) {
            pieceSelectionnee.classList.remove("selected");
        }

        pieceSelectionnee = piece;
        pieceSelectionnee.classList.add("selected");

        afficherMouvementsPossibles(pieceSelectionnee);
    }
}

function afficherMouvementsPossibles(piece) {
    nettoyerMouvements(); 

    const [_, ligne, col] = piece.id.split("-").map(Number); 

    const mouvements = [
        { ligne: ligne - 1, col }, 
        { ligne: ligne + 1, col }, 
        { ligne, col: col - 1 }, 
        { ligne, col: col + 1 } 
    ];

    mouvements.forEach(mouvement => {
        const caseCible = document.getElementById(`case-${mouvement.ligne}-${mouvement.col}`);
        if (caseCible && !caseCible.style.backgroundImage) { 
            caseCible.classList.add("mouvement-possible");
            caseCible.addEventListener("click", deplacerPiece); 
        }
    });
}

function nettoyerMouvements() {
    const cases = document.querySelectorAll(".mouvement-possible");
    cases.forEach(caseElement => {
        caseElement.classList.remove("mouvement-possible");
        caseElement.removeEventListener("click", deplacerPiece);
    });
}

function deplacerPiece(event) {
  const caseCible = event.target;

  caseCible.style.backgroundImage = pieceSelectionnee.style.backgroundImage;
  
  const rotation = pieceSelectionnee.dataset.rotation;

  caseCible.style.transform = `rotate(${rotation}deg)`;

  caseCible.dataset.rotation = rotation;  

  pieceSelectionnee.style.backgroundImage = "";
  pieceSelectionnee.style.transform = '';  
  pieceSelectionnee.dataset.rotation = '';  
  pieceSelectionnee.classList.remove("selected");
  pieceSelectionnee = null;
  nettoyerMouvements();

  joueurActif = joueurActif === "Rouge" ? "Bleu" : "Rouge";

  mettreEnEvidencePieces();
}


document.addEventListener('DOMContentLoaded', function () {
    
    mettreEnEvidencePieces();

    const cases = document.querySelectorAll(`[id^="case"]`);
    cases.forEach(caseElement => {
        caseElement.addEventListener("click", selectionnerPiece);
    });
});
*/