const nb_ligne = 7;
const nb_col = 5;   

document.addEventListener('DOMContentLoaded', function() {

  const plateau = document.getElementById('plateau');
  const casesContainer = document.getElementById('cases-container');
  const selection = document.getElementById('selection');

  plateau.style.backgroundImage = `url('assets/plateau.png')`;

    for (let i = 0; i < nb_ligne; i++) {
      for (let j = 0; j < nb_col; j++) {
          const caseElement = document.createElement('div');
          caseElement.classList.add('case');
          caseElement.setAttribute('case_vide', true);
          caseElement.id = `case-${i}-${j}`;
          casesContainer.append(caseElement);
      }
  }

  for (let x = 0; x < nb_col; x++) {
    var x_case = document.getElementById(`case-0-${x}`);
    x_case.style.backgroundImage = `url('assets/Rouge${x}.png')`;
    x_case.style.transform = 'rotate(180deg)';
    x_case.dataset.rotation = '180';
    x_case.setAttribute('couleur', 'rouge');
    x_case.setAttribute('case_vide', false);
  }

  for (let y = 0; y < nb_col; y++) {
    var y_case = document.getElementById(`case-6-${y}`);
    y_case.style.backgroundImage = `url('assets/Bleu${y}.png')`;
    y_case.dataset.rotation = '0';
    y_case.setAttribute('couleur', 'bleu');
    y_case.setAttribute('case_vide', false);
  }

  for (let i = 1; i < 4; i++) {
    var k = aleatoire(1, 4);
    var caillou_case = document.getElementById(`case-3-${i}`);
    caillou_case.style.backgroundImage = `url('assets/Caillou${k}.png')`;
    caillou_case.setAttribute('couleur', 'caillou');
    caillou_case.setAttribute('case_vide', false);
  }

  const pions = document.getElementsByClassName('case');
  const position_mise_en_jeu = [[1, 0], [1, 1], [1, 3], [1, 4], [2, 0], [2, 4], [3, 0], [3, 4], [4, 0], [4, 4], [5, 0], [5, 1], [5, 3], [5, 4]];
  const cases_inaccecibles_debut = [[1, 2], [2, 1], [2, 2], [2, 3], [4, 1], [4, 2], [4, 3], [5, 2]]
  const position_banc_rouge = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
  const position_banc_bleu = [[6, 0],[6, 1], [6, 2], [6, 3], [6, 4]];

  let compt = 0;
  let click1Done = false;
  let pionSelectionne = null;

  console.log("Selectionnez une pièce a bouger :")
  Array.from(pions).forEach(pion => {
    pion.addEventListener('click', (event) => {
        if (!click1Done) {
            console.log("La pièce a été sélectionnée !");
            console.log("Selectionnez où vous voulez la déplacer :")
            pion.style.border = "2px solid red";
            compt++;
            console.log(compt);
            if (pion.getAttribute('case_vide') == 'false' && !(pion.getAttribute('couleur') == 'caillou')) {
                if (pion.getAttribute('couleur') == 'rouge' && compt < 3) {
                    position_mise_en_jeu.forEach(([x, y]) => {
                        const caseElement = document.getElementById(`case-${x}-${y}`);
                        if (caseElement) {
                            caseElement.style.backgroundColor = 'rgba(255, 0, 0, 0.5)';
                        }
                    });
                    cases_inaccecibles_debut.forEach(([x, y]) => {
                        const caseElement = document.getElementById(`case-${x}-${y}`);
                        if (caseElement) {
                            caseElement.style.backgroundImage = `url('assets/croix.png')`;
                            caseElement.setAttribute('case_vide', false);
                        }
                    });
                } else if (pion.getAttribute('couleur') == 'bleu' && compt < 3) {
                    position_mise_en_jeu.forEach(([x, y]) => {
                        const caseElement = document.getElementById(`case-${x}-${y}`);
                        if (caseElement) {
                            caseElement.style.backgroundColor = 'rgba(0, 0, 255, 0.5)';
                        }
                    });
                    cases_inaccecibles_debut.forEach(([x, y]) => {
                        const caseElement = document.getElementById(`case-${x}-${y}`);
                        if (caseElement) {
                            caseElement.style.backgroundImage = `url('assets/croix.png')`;
                            caseElement.setAttribute('case_vide', false);
                        }
                    });
                } else if (compt >= 3) {
                    position_mise_en_jeu.forEach(([x, y]) => {
                        const caseElement = document.getElementById(`case-${x}-${y}`);
                        if (caseElement) {
                            caseElement.style.backgroundColor = 'transparent';
                        }
                    });
                    cases_inaccecibles_debut.forEach(([x, y]) => {
                        const caseElement = document.getElementById(`case-${x}-${y}`);
                        if (caseElement) {
                            caseElement.style.backgroundImage = null;
                            caseElement.setAttribute('case_vide', true);
                        }
                    });
                }
                pionSelectionne = pion;
                click1Done = true;
            } else {
                click1Done = false;
                pionSelectionne = null;
                compt -= 1;
                console.log("Fail");
            }
        } else {
            if (pion !== pionSelectionne && pion.getAttribute('case_vide') == 'true') {
                console.log("Bougée !");
                pion.style.backgroundImage = pionSelectionne.style.backgroundImage;
                pionSelectionne.style.backgroundImage = null;
                pionSelectionne.style.backgroundColor = 'transparent';
                pion.style.backgroundColor = 'transparent';
                pion.setAttribute('case_vide', 'false');
                pionSelectionne.setAttribute('case_vide', 'true');
                pion.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                pionSelectionne.setAttribute('couleur', null);
                pionSelectionne.style.border = null;
                const x_y_pion_id = obtenirCoordonnees(pion.id);
                enleverElement(position_mise_en_jeu, x_y_pion_id);
                const pionSelectionneId = pionSelectionne.id;
                pionSelectionne.id = pion.id;
                pion.id = pionSelectionneId;
            } else {
                console.log("fail");
                compt -= 1;
            }
            pionSelectionne = null;
            pion = null;
            click1Done = false;
        }
    });
});
});
                
function aleatoire (a, b) {
  return Math.round(Math.random() * (b - a) + a)
}

function enleverElement(tab, element) {
    const index = tab.findIndex(item => item[0] === element[0] && item[1] === element[1]);
    if (index > -1) {
        tab.splice(index, 1);
    }
    return tab;
}

function obtenirCoordonnees(id) {
    const parts = id.split('-');
    const x = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    return [x, y];
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