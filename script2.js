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
        y_case.style.transform = 'rotate(0deg)';
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
    const position_mise_en_jeu2 = [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 4], [3, 0], [3, 4], [4, 0], [4, 4], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4]];
    const position_en_jeu = [[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [2, 0], [2, 4], [3, 0], [3, 4], [4, 0], [4, 4], [5, 0], [5, 1], [5, 2], [5, 3], [5, 4]];
    const cases_inaccecibles_debut = [[1, 2], [5, 2]]
    const position_banc_rouge = [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]];
    const position_banc_bleu = [[6, 0],[6, 1], [6, 2], [6, 3], [6, 4]];

    let compt = 0;
    let click1Done = false;
    let pionSelectionne = null;
    let pionRef = null;
    let tourBleu = true;
    let casesInaccessiblesMarquees = false;
    let vientDeBouger = false;

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

    function enleverBordures() {
        Array.from(pions).forEach(pion => {
            pion.style.border = 'none';
        });
    }

    function retourPionBanc(pion) {
        const couleur = pion.getAttribute('couleur');
        const banc = couleur === 'rouge' ? position_banc_rouge : position_banc_bleu;
        const caseVide = banc.find(([x, y]) => document.getElementById(`case-${x}-${y}`).getAttribute('case_vide') === 'true');
        console.log('la case vide trouvée est : ', caseVide);
        if (caseVide) {
            const [x, y] = caseVide;
            const caseElement = document.getElementById(`case-${x}-${y}`);
            caseElement.style.backgroundImage = pion.style.backgroundImage;
            caseElement.style.transform = pion.style.transform;
            caseElement.setAttribute('case_vide', 'false');
            caseElement.setAttribute('couleur', couleur);
            pion.style.backgroundImage = null;
            pion.style.transform = '';
            pion.setAttribute('case_vide', 'true');
            pion.setAttribute('couleur', null);
            pion.style.border = 'none';
        }
    }

    function PermierClickk(pion) {
        console.log("La pièce a été sélectionnée !");
        console.log("Selectionnez où vous voulez la déplacer :");
        enleverBordures();
        pion.style.border = "2px solid red";
        compt++;

        const pionPosition = pion.id.split('-').slice(1).map(Number); // Assuming pion id is in the format 'case-x-y'
        const isInBancRouge = position_banc_rouge.some(([x, y]) => x === pionPosition[0] && y === pionPosition[1]);
        const isInBancBleu = position_banc_bleu.some(([x, y]) => x === pionPosition[0] && y === pionPosition[1]);

        if (pion.getAttribute('case_vide') == 'false' && pion.getAttribute('couleur') != 'caillou') {
            if (compt < 3) {
                const color = pion.getAttribute('couleur') == 'rouge' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
                marquerMiseEnJeu(pion, color, position_mise_en_jeu);
                marquerCasesInaccessibles(cases_inaccecibles_debut, `url('assets/croix.png')`, false);
            } else if ((isInBancRouge || isInBancBleu) && compt >= 3) {
                const color = pion.getAttribute('couleur') == 'rouge' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(0, 0, 255, 0.5)';
                marquerMiseEnJeu(pion, color, position_mise_en_jeu);
                if (!casesInaccessiblesMarquees) {
                    marquerCasesInaccessibles(cases_inaccecibles_debut, 'none', true);
                    casesInaccessiblesMarquees = true;
                }
                pionSelectionne = pion;
                click1Done = true;
            } else {
                marquerMiseEnJeu(pion, 'rgba(0, 0, 0, 0)', position_mise_en_jeu);
                if (!casesInaccessiblesMarquees) {
                    marquerCasesInaccessibles(cases_inaccecibles_debut, 'none', true);
                    casesInaccessiblesMarquees = true;
                }
                pionSelectionne = pion;
                click1Done = true;
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
        
        if ((appartientALaListe(coordPionSelectionne, position_banc_rouge) || appartientALaListe(coordPionSelectionne, position_banc_bleu)) && !appartientALaListe(coordPion, position_mise_en_jeu)) {
            console.log("Vous ne pouvez pas déplacer la pièce ici !");
            return;
        }
        if (appartientALaListe(coordPionSelectionne, position_en_jeu)) {
            const deplacementsPossibles = [[coordPion[0] - 1, coordPion[1]], [coordPion[0] + 1, coordPion[1]], [coordPion[0], coordPion[1] - 1], [coordPion[0], coordPion[1] + 1]];
            if (!deplacementsPossibles.some(([x, y]) => x === coordPionSelectionne[0] && y === coordPionSelectionne[1])) {
                console.log("Vous ne pouvez pas déplacer la pièce ici !");
                return;
            } else if (appartientALaListe(coordPion, position_banc_rouge) || appartientALaListe(coordPion, position_banc_bleu)) {
                console.log("Vous ne pouvez pas déplacer la pièce ici !");
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
                pion.setAttribute('case_vide', 'false');
                pionSelectionne.setAttribute('case_vide', 'true');
                pion.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                pionSelectionne.setAttribute('couleur', null);
                pionSelectionne.style.border = 'none';
                pion.style.border = "2px solid red";
                pion.style.transform = pionSelectionne.style.transform;
                const x_y_pion_id = obtenirCoordonnees(pion.id);
                vientDeBouger = true;
            } else {
                console.log("ce n'est pas votre tour !");
                pionSelectionne = null;
                click1Done = false;
            }
        } else {
            console.log("fail");
        }
    }

    function terminerTour() {
        tourBleu = !tourBleu;
        tourTexte.innerText = tourBleu ? 'Tour: Bleu' : 'Tour: Rouge';
        tourTexte.style.color = tourBleu ? 'blue' : 'red';
        click1Done = false;
        enleverBordures();
        pionSelectionne = null;
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

    const orientations = {devant: '0', droite: '90', arriere: '180', gauche: '270'};
    Object.keys(orientations).forEach(orientation => {
        const button = document.createElement('button');
        button.innerText = orientation;
        button.classList.add('rotation-button');
        button.style.gridArea = orientation;
        button.addEventListener('click', () => {
            if (pionSelectionne && !vientDeBouger) {
                console.log(`Orientation choisie : ${orientations[orientation]}°`);
                pionSelectionne.style.transform = `rotate(${orientations[orientation]}deg)`;
                terminerTour();
            } else if (vientDeBouger) {
                console.log(`Orientation choisie : ${orientations[orientation]}°`);
                pionRef.style.transform = `rotate(${orientations[orientation]}deg)`;
                vientDeBouger = false;
                terminerTour();
            }
        });
        rotationContainer.appendChild(button);
    });

    const finishButton = document.createElement('button');
    finishButton.innerText = 'Terminer';
    finishButton.id = 'finish-button';
    finishButton.classList.add('rotation-button');
    finishButton.addEventListener('click', () => {
        console.log('Tour terminé');
        terminerTour();
    });
    rotationContainer.appendChild(finishButton);

    const backPion = document.createElement('button');
    backPion.innerText = 'Faire sortir le pion';
    backPion.id = 'back-button';
    backPion.classList.add('rotation-button');
    backPion.addEventListener('click', () => {
        if (appartientALaListe(obtenirCoordonnees(pionSelectionne.id), position_mise_en_jeu2)) {
            console.log("le pion fait partie de la mise en jeu");
            retourPionBanc(pionSelectionne);
            terminerTour();
        } else {
            console.log("le pion n'est pas sur un bord");
        }
    });
    rotationContainer.appendChild(backPion);

    const pousserButton = document.createElement('button');
    pousserButton.innerText = 'Pousser';
    pousserButton.id = 'pousser-button';
    pousserButton.classList.add('rotation-button');
    pousserButton.addEventListener('click', () => {
        console.log('Boutton cliqué');
        let puissancePerso = 2;
        let puissanceAdversaire = 0;
        const couleur = pionSelectionne.getAttribute('couleur');

        if (obtenirOrientation(pionSelectionne) == 'rotate(0deg)') {
            console.log('Orientation : devant');
            let orientationInverse = 'rotate(180deg)';
            let pionDevant1 = null, pionDevant2 = null, pionDevant3 = null, pionDevant4 = null;
            if (aPionDevant(pionSelectionne)) pionDevant1 = obtenirPionDevant(pionSelectionne);
            if (pionDevant1 && aPionDevant(pionDevant1)) pionDevant2 = obtenirPionDevant(pionDevant1);
            if (pionDevant2 && aPionDevant(pionDevant2)) pionDevant3 = obtenirPionDevant(pionDevant2);
            if (pionDevant3 && aPionDevant(pionDevant3)) pionDevant4 = obtenirPionDevant(pionDevant3);
            console.log('PionSelectionne : ', pionSelectionne);
            console.log('pionDevant1 : ', pionDevant1);
            console.log('pionDevant2 : ', pionDevant2);
            console.log('pionDevant3 : ', pionDevant3);
            if (pionDevant1 && pionDevant1.getAttribute('couleur') == couleur && obtenirOrientation(pionDevant1) == 'rotate(0deg)') {
                puissancePerso += 2;
                console.log("puissancePerso : ", puissancePerso);
                if (pionDevant2 && pionDevant2.getAttribute('couleur') == couleur && obtenirOrientation(pionDevant2) == 'rotate(0deg)') {
                    puissancePerso += 2;
                    console.log("puissancePerso : ", puissancePerso);
                    if (pionDevant3 && pionDevant3.getAttribute('couleur') == couleur && obtenirOrientation(pionDevant3) == 'rotate(0deg)') {
                        puissancePerso += 2;
                        console.log("puissancePerso : ", puissancePerso);
                    }
                }
            }
            if (pionDevant1 && pionDevant1.getAttribute('couleur') == 'rouge' && obtenirOrientation(pionDevant1) == orientationInverse) {
                puissanceAdversaire += 2;
                console.log("puissanceAdversaire : ", puissanceAdversaire);
                if (pionDevant2 && pionDevant2.getAttribute('couleur') == 'rouge' && obtenirOrientation(pionDevant2) == orientationInverse) {
                    puissanceAdversaire += 2;
                    console.log("puissanceAdversaire : ", puissanceAdversaire);
                    if (pionDevant3 && pionDevant3.getAttribute('couleur') == 'rouge' && obtenirOrientation(pionDevant3) == orientationInverse) {
                        puissanceAdversaire += 2;
                        console.log("puissanceAdversaire : ", puissanceAdversaire);
                    }
                }
            } else if (pionDevant1 && pionDevant1.getAttribute('couleur') == 'caillou') {
                puissanceAdversaire += 1;
                console.log("puissanceAdversaire : ", puissanceAdversaire);
                if (pionDevant2 && pionDevant2.getAttribute('couleur') == 'caillou') {
                    puissanceAdversaire += 1;
                    console.log("puissanceAdversaire : ", puissanceAdversaire);
                    if (pionDevant3 && pionDevant3.getAttribute('couleur') == 'caillou') {
                        puissanceAdversaire += 1;
                        console.log("puissanceAdversaire : ", puissanceAdversaire);
                    }
                }
            }
        
        } else if (obtenirOrientation(pionSelectionne) == 'rotate(180deg)') {
            console.log('Orientation : derriere');
            let pionDerriere1 = null, pionDerriere2 = null, pionDerriere3 = null;
            if (aPionDerriere(pionSelectionne)) pionDerriere1 = obtenirPionDerriere(pionSelectionne);
            if (pionDerriere1 && aPionDerriere(pionDerriere1)) pionDerriere2 = obtenirPionDerriere(pionDerriere1);
            if (pionDerriere2 && aPionDerriere(pionDerriere2)) pionDerriere3 = obtenirPionDerriere(pionDerriere2);
            console.log('PionSelectionne : ', pionSelectionne);
            console.log('pionDerriere1 : ', pionDerriere1);
            console.log('pionDerriere2 : ', pionDerriere2);
            console.log('pionDerriere3 : ', pionDerriere3);
            if (pionDerriere1 && pionDerriere1.getAttribute('couleur') == couleur && obtenirOrientation(pionDerriere1) == 'rotate(180deg)') {
                puissancePerso += 2;
                console.log("puissancePerso : ", puissancePerso);
                if (pionDerriere2 && pionDerriere2.getAttribute('couleur') == couleur && obtenirOrientation(pionDerriere2) == 'rotate(180deg)') {
                    puissancePerso += 2;
                    console.log("puissancePerso : ", puissancePerso);
                    if (pionDerriere3 && pionDerriere3.getAttribute('couleur') == couleur && obtenirOrientation(pionDerriere3) == 'rotate(180deg)') {
                        puissancePerso += 2;
                        console.log("puissancePerso : ", puissancePerso);
                    }
                }
            }
        } else if (obtenirOrientation(pionSelectionne) == 'rotate(270deg)') {
            console.log('Orientation : gauche');
            let pionGauche1 = null, pionGauche2 = null, pionGauche3 = null;
            if (aPionGauche(pionSelectionne)) pionGauche1 = obtenirPionGauche(pionSelectionne);
            if (pionGauche1 && aPionGauche(pionGauche1)) pionGauche2 = obtenirPionGauche(pionGauche1);
            if (pionGauche2 && aPionGauche(pionGauche2)) pionGauche3 = obtenirPionGauche(pionGauche2);
            console.log('PionSelectionne : ', pionSelectionne);
            console.log('pionGauche1 : ', pionGauche1);
            console.log('pionGauche2 : ', pionGauche2);
            console.log('pionGauche3 : ', pionGauche3);
            if (pionGauche1 && pionGauche1.getAttribute('couleur') == couleur && obtenirOrientation(pionGauche1) == 'rotate(270deg)') {
                puissancePerso += 2;
                console.log("puissancePerso : ", puissancePerso);
                if (pionGauche2 && pionGauche2.getAttribute('couleur') == couleur && obtenirOrientation(pionGauche2) == 'rotate(270deg)') {
                    puissancePerso += 2;
                    console.log("puissancePerso : ", puissancePerso);
                    if (pionGauche3 && pionGauche3.getAttribute('couleur') == couleur && obtenirOrientation(pionGauche3) == 'rotate(270deg)') {
                        puissancePerso += 2;
                        console.log("puissancePerso : ", puissancePerso);
                    }
                }
            } 
        } else if (obtenirOrientation(pionSelectionne) == 'rotate(90deg)') {
            console.log('Orientation : droite');
            let pionDroite1 = null, pionDroite2 = null, pionDroite3 = null;
            if (aPionDroite(pionSelectionne)) pionDroite1 = obtenirPionDroite(pionSelectionne);
            if (pionDroite1 && aPionDroite(pionDroite1)) pionDroite2 = obtenirPionDroite(pionDroite1);
            if (pionDroite2 && aPionDroite(pionDroite2)) pionDroite3 = obtenirPionDroite(pionDroite2);
            console.log('PionSelectionne : ', pionSelectionne);
            console.log('pionDroite1 : ', pionDroite1);
            console.log('pionDroite2 : ', pionDroite2);
            console.log('pionDroite3 : ', pionDroite3);
            if (pionDroite1 && pionDroite1.getAttribute('couleur') == couleur && obtenirOrientation(pionDroite1) == 'rotate(90deg)') {
                puissancePerso += 2;
                console.log("puissancePerso : ", puissancePerso);
                if (pionDroite2 && pionDroite2.getAttribute('couleur') == couleur && obtenirOrientation(pionDroite2) == 'rotate(90deg)') {
                    puissancePerso += 2;
                    console.log("puissancePerso : ", puissancePerso);
                    if (pionDroite3 && pionDroite3.getAttribute('couleur') == couleur && obtenirOrientation(pionDroite3) == 'rotate(90deg)') {
                        puissancePerso += 2;
                        console.log("puissancePerso : ", puissancePerso);
                    }
                }
            }  
        } else {
            console.log('Orientation non reconnue');
        }

    });
    rotationContainer.appendChild(pousserButton);

    function obtenirPionDevant(pion) {
        const coord = obtenirCoordonnees(pion.id);
        const x = coord[0] - 1;
        const y = coord[1];
        if (x < nb_ligne) {
            return document.getElementById(`case-${x}-${y}`);
        } else {
            console.log('Hors du plateau');
            return null;
        }
    }

    function aPionDevant(pion) {
        const pionDevant = obtenirPionDevant(pion);
        return pionDevant && pionDevant.getAttribute('couleur') !== null;
    }
    
    function obtenirPionDerriere(pion) {
        const coord = obtenirCoordonnees(pion.id);
        const x = coord[0] + 1;
        const y = coord[1];
        if (x < nb_ligne) {
            return document.getElementById(`case-${x}-${y}`);
        } else {
            console.log('Hors du plateau');
            return null;
        }
    }
    
    function aPionDerriere(pion) {
        const pionDerriere = obtenirPionDerriere(pion);
        return pionDerriere && pionDerriere.getAttribute('couleur') !== null;
    }
    
    function obtenirPionGauche(pion) {
        const coord = obtenirCoordonnees(pion.id);
        const x = coord[0];
        const y = coord[1] - 1;
        if (y >= 0) {
            return document.getElementById(`case-${x}-${y}`);
        } else {
            console.log('Hors du plateau');
            return null;
        }
    }

    function aPionGauche(pion) {
        const pionGauche = obtenirPionGauche(pion);
        return pionGauche && pionGauche.getAttribute('couleur') !== null;
    }
    
    function obtenirPionDroite(pion) {
        const coord = obtenirCoordonnees(pion.id);
        const x = coord[0];
        const y = coord[1] + 1;
        if (y < nb_col) {
            return document.getElementById(`case-${x}-${y}`);
        } else {
            console.log('Hors du plateau');
            return null;
        }
    }

    function aPionDroite(pion) {
        const pionDroite = obtenirPionDroite(pion);
        return pionDroite && pionDroite.getAttribute('couleur') !== null;
    }
    
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

function comparerTableaux(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

function appartientALaListe(coordonnees, liste) {
    for (let i = 0; i < liste.length; i++) {
        if (comparerTableaux(coordonnees, liste[i])) {
            return true;
        }
    }
    return false;
}

function obtenirOrientation(pion) {
    return pion.style.transform;
}