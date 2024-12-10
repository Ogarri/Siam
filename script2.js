const nb_ligne = 7;
const nb_col = 5;   

document.addEventListener('DOMContentLoaded', function() {

    const plateauContainer = document.createElement('div');
    plateauContainer.id = 'plateau-container';
    document.body.appendChild(plateauContainer);

    const plateau = document.getElementById('plateau');
    const casesContainer = document.getElementById('cases-container');
    plateauContainer.appendChild(plateau);

    const rotationContainer = document.getElementById('rotation-container');
    plateauContainer.appendChild(rotationContainer);

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
    const position_mise_en_jeu = [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 4], [3, 0], [3, 4], [4, 0], [4, 4], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4]];
    const position_en_jeu = [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 4], [3, 0], [3, 4], [4, 0], [4, 4], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4]];
    const cases_inaccecibles_debut = [[1, 2], [5, 2]]
    const position_banc_rouge = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    const position_banc_bleu = [[6, 0],[6, 1], [6, 2], [6, 3], [6, 4]];

    let compt = 0;
    let click1Done = false;
    let pionSelectionne = null;
    let pionRef = null;
    let tourBleu = true;

    console.log("Selectionnez une pièce a bouger :")
  
    function marquerMiseEnJeu(pion, color, cases) {
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

        const pionPosition = pion.id.split('-').slice(1).map(Number); // Assuming pion id is in the format 'case-x-y'
        const isInBancRouge = position_banc_rouge.some(([x, y]) => x === pionPosition[0] && y === pionPosition[1]);
        const isInBancBleu = position_banc_bleu.some(([x, y]) => x === pionPosition[0] && y === pionPosition[1]);


        if (pion.getAttribute('case_vide') == 'false' && pion.getAttribute('couleur') != 'caillou') {
            if (compt < 3) {
                const color = pion.getAttribute('couleur') == 'rouge' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
                marquerMiseEnJeu(pion, color, position_mise_en_jeu);
                marquerCasesInaccessibles(cases_inaccecibles_debut, `url('assets/croix.png')`, false);
            } else {
                marquerMiseEnJeu(pion, 'transparent', position_mise_en_jeu);
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
        const coordPionSelectionne = obtenirCoordonnees(pionSelectionne.id);
        const coordPion = obtenirCoordonnees(pion.id);
        const save = (appartientALaListe(coordPionSelectionne, position_banc_rouge) || appartientALaListe(coordPionSelectionne, position_banc_bleu)) && !appartientALaListe(coordPion, position_mise_en_jeu);
    
        if ((appartientALaListe(coordPionSelectionne, position_banc_rouge) || appartientALaListe(coordPionSelectionne, position_banc_bleu)) && !appartientALaListe(coordPion, position_mise_en_jeu)) {
            console.log("Vous ne pouvez pas déplacer la pièce ici !");
            compt--;
            pionSelectionne.style.border = 'none';
            pionSelectionne = null;
            pion = null;
            click1Done = false;
            return;
        }
        if (appartientALaListe(coordPionSelectionne, position_en_jeu)) {
            const deplacementsPossibles = [[coordPion[0] - 1, coordPion[1]], [coordPion[0] + 1, coordPion[1]], [coordPion[0], coordPion[1] - 1], [coordPion[0], coordPion[1] + 1]];
            if (!deplacementsPossibles.some(([x, y]) => x === coordPionSelectionne[0] && y === coordPionSelectionne[1])) {
                console.log("Vous ne pouvez pas déplacer la pièce ici !");
                compt--;
                pionSelectionne.style.border = 'none';
                pionSelectionne = null;
                pion = null;
                click1Done = false;
                return;
            } else if (appartientALaListe(coordPion, position_banc_rouge) || appartientALaListe(coordPion, position_banc_bleu)) {
                console.log("Vous ne pouvez pas déplacer la pièce ici !");
                compt--;
                pionSelectionne.style.border = 'none';
                pionSelectionne = null;
                pion = null;
                click1Done = false;
                return;
            }   
        }
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
                pion.style.transform = pionSelectionne.style.transform;
                const x_y_pion_id = obtenirCoordonnees(pion.id);
                enleverElement(position_mise_en_jeu, x_y_pion_id);

                const orientations = {devant: '0', droite: '90', arriere: '180', gauche: '270'};

                Object.keys(orientations).forEach(orientation => {
                    const button = document.createElement('button');
                    button.innerText = orientation;
                    button.classList.add('rotation-button');
                    button.style.gridArea = orientation;
                    button.addEventListener('click', () => {
                        console.log(`Orientation choisie : ${orientations[orientation]}°`);
                        pionRef.style.transform = `rotate(${orientations[orientation]}deg)`;
                    });
                    if (compt <= 1) rotationContainer.appendChild(button);
                });

                const finishButton = document.createElement('button');
                finishButton.innerText = 'Terminer';
                finishButton.id = 'finish-button';
                finishButton.classList.add('rotation-button');
                finishButton.addEventListener('click', () => {
                    console.log('rotation terminée');
                    const buttons = rotationContainer.getElementsByTagName('button');
                    for (let i = 0; i < buttons.length; i++) {
                        pionRef.style.border = 'none';
                    }
                    tourBleu = !tourBleu;
                    tourTexte.innerText = tourBleu ? 'Tour: Bleu' : 'Tour: Rouge';
                    tourTexte.style.color = tourBleu ? 'blue' : 'red';
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

    const tourTexte = document.createElement('div');
    tourTexte.id = 'tour-texte';
    tourTexte.innerText = tourBleu ? 'Tour: Bleu' : 'Tour: Rouge';
    tourTexte.style.color = tourBleu ? 'blue' : 'red';
    rotationContainer.appendChild(tourTexte);

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

function appartientALaListe(coordonnees, liste) {
    if (!liste) return false;
    return liste.some(([x, y]) => x === coordonnees[0] && y === coordonnees[1]);
}