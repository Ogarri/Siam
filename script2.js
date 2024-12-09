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
  const cases_inaccecibles_debut = [[1, 2], [5, 2]]
  const position_banc_rouge = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
  const position_banc_bleu = [[6, 0],[6, 1], [6, 2], [6, 3], [6, 4]];

  let compt = 0;
  let click1Done = false;
  let pionSelectionne = null;
  let pionRef = null;
  let tourBleu = true;

  console.log("Selectionnez une pièce a bouger :")
  function highlightCases(pion, color, cases) {
    cases.forEach(([x, y]) => {
        const caseElement = document.getElementById(`case-${x}-${y}`);
        if (caseElement) {
            caseElement.style.backgroundColor = color;
        }
    });
}

function marquerCasesInaccessibles(cases, image, isEmpty) {
    cases.forEach(([x, y]) => {
        const caseElement = document.getElementById(`case-${x}-${y}`);
        if (caseElement) {
            caseElement.style.backgroundImage = image;
            caseElement.setAttribute('case_vide', isEmpty);
        }
    });
}

function PermierClickk(pion) {
    console.log("La pièce a été sélectionnée !");
    console.log("Selectionnez où vous voulez la déplacer :");
    pion.style.border = "2px solid red";
    compt++;
    console.log(compt);

    if (pion.getAttribute('case_vide') == 'false' && pion.getAttribute('couleur') != 'caillou') {
        if (compt < 3) {
            const color = pion.getAttribute('couleur') == 'rouge' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
            highlightCases(pion, color, position_mise_en_jeu);
            marquerCasesInaccessibles(cases_inaccecibles_debut, `url('assets/croix.png')`, false);
        } else {
            highlightCases(pion, 'transparent', position_mise_en_jeu);
            marquerCasesInaccessibles(cases_inaccecibles_debut, null, true);
        }
        pionSelectionne = pion;
        click1Done = true;
    } else {
        click1Done = false;
        pionSelectionne = null;
        compt--;
        console.log("Fail");
        pion.style.border = 'none';
    }
}

function FaireSecondClick(pion) {
    pionRef = pion;
    if (pion !== pionSelectionne && pion.getAttribute('case_vide') == 'true') {
        const couleurPionSelectionne = pionSelectionne.getAttribute('couleur');
        if ((tourBleu && couleurPionSelectionne === 'bleu') || (!tourBleu && couleurPionSelectionne === 'rouge')) {
            console.log("Bougée !");
            pion.style.backgroundImage = pionSelectionne.style.backgroundImage;
            pionSelectionne.style.backgroundImage = null;
            pionSelectionne.style.backgroundColor = 'transparent';
            pion.style.backgroundColor = 'transparent';
            pion.setAttribute('case_vide', 'false');
            pionSelectionne.setAttribute('case_vide', 'true');
            pion.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
            pionSelectionne.setAttribute('couleur', null);
            pionSelectionne.style.border = 'none';
            pion.style.border = "2px solid red";
            const x_y_pion_id = obtenirCoordonnees(pion.id);
            enleverElement(position_mise_en_jeu, x_y_pion_id);

            const rotationContainer = document.getElementById('rotation-container');
            const orientations = {devant: '0', droite: '90', arriere: '180', gauche: '270'};

            Object.keys(orientations).forEach(orientation => {
                const button = document.createElement('button');
                button.innerText = orientation;
                button.addEventListener('click', () => {
                    console.log(`Orientation choisie : ${orientations[orientation]}°`);
                    pionRef.style.transform = `rotate(${orientations[orientation]}deg)`;
                });
                if (compt <= 1) rotationContainer.appendChild(button);
            });

            const finishButton = document.createElement('button');
            finishButton.innerText = 'Terminer';
            finishButton.addEventListener('click', () => {
                console.log('rotation terminée');
                const buttons = rotationContainer.getElementsByTagName('button');
                for (let i = 0; i < buttons.length; i++) {
                    pionRef.style.border = 'none';
                }
                tourBleu = !tourBleu;
            });
            if (compt <= 1) rotationContainer.appendChild(finishButton);
        } else {
            console.log("ce n'est pas votre tour !");
            compt--;
            pionSelectionne.style.border = 'none';
        }
    } else {
        console.log("fail");
        compt--;
        pionSelectionne.style.border = 'none';
    }
    pionSelectionne = null;
    pion = null;
    click1Done = false;
}

Array.from(pions).forEach(pion => {
    pion.addEventListener('click', (event) => {
        if (!click1Done) {
            PermierClickk(pion);
        } else {
            FaireSecondClick(pion);
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