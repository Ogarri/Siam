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
                pionSelectionne.style.transform = '';
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
        console.log('Puissance adversaire : ', puissanceAdversaire);
        console.log('Puissance perso : ', puissancePerso);
        const couleur = pionSelectionne.getAttribute('couleur');
        const couleurInverse = couleur === 'rouge' ? 'bleu' : 'rouge';

        if (obtenirOrientation(pionSelectionne) == 'rotate(0deg)') {
            console.log('Orientation : devant');
            let orientationInverse = 'rotate(180deg)';

            function compterPuissanceDevant(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 0) {
                    return puissanceAdversaire;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                        puissanceAdversaire++;
                        return compterPuissanceDevant(obtenirPionDevant(regard));
                } else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pionSelectionne)) {
                    puissancePerso += 2;
                    return compterPuissanceDevant(obtenirPionDevant(regard));
                } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                    puissanceAdversaire += 2;
                    return compterPuissanceDevant(obtenirPionDevant(regard));
                }
            }
            compterPuissanceDevant(obtenirPionDevant(pionSelectionne));
            console.log('Puissance adversaire : ', puissanceAdversaire);
            console.log('Puissance perso : ', puissancePerso);

            function nbPiecesDevant(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    console.log('Caillou trouvé');
                    return compteur + nbPiecesDevant(obtenirPionDevant(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    console.log('Pion trouvé');
                    return compteur + nbPiecesDevant(obtenirPionDevant(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces devant : ', nbPiecesDevant(obtenirPionDevant(pionSelectionne)));

            function estSurLeBordDevantPion(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 1 && (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse)) {
                    console.log('un pion est sur le bord');
                    return true;
                }
                return false;
            }

            function estSurLeBordDevantCaillou(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 0 && regard.getAttribute('couleur') == 'caillou') {
                    console.log('un caillou est sur le bord');
                    return true;
                }
                return false;
            }

            let nombreDePassages = 0;
            function pousserPionDevant(regard) {
                let pionDevant = obtenirPionDevant(regard);
                let pionDevantDevant = obtenirPionDevant(pionDevant);
                if (obtenirCoordonnees(pionDevantDevant.id)[0] == 0 && (pionDevant.getAttribute('couleur') == couleur || pionDevant.getAttribute('couleur') == couleurInverse)) {
                    console.log('un pion est sur le bord');
                    return;
                }
                if (nombreDePassages == 0) {
                    if (pionDevant && pionDevantDevant) {                        
                        pionDevantDevant.style.backgroundImage = pionDevant.style.backgroundImage;
                        pionDevantDevant.setAttribute('couleur', pionDevant.getAttribute('couleur'));
                        pionDevantDevant.style.transform = pionDevant.style.transform;
                        pionDevantDevant.setAttribute('case_vide', 'false');
                        pionDevant.style.backgroundImage = regard.style.backgroundImage;
                        pionDevant.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDevant.style.transform = regard.style.transform;
                        pionDevant.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        nombreDePassages++;
                    } else {
                        retourPionBanc(pionDevantDevant);
                        nombreDePassages++;
                    }
                } else {
                    if (pionDevant) {
                        pionDevant.style.backgroundImage = regard.style.backgroundImage;
                        pionDevant.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDevant.style.transform = regard.style.transform;
                        pionDevant.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                    }
                }
            }

            if (puissancePerso > puissanceAdversaire) {
                console.log('Poussée réussie');
                if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 1) {  
                    if (estSurLeBordDevantPion(obtenirPionDevant(pionSelectionne))) {
                        retourPionBanc(obtenirPionDevant(pionSelectionne));
                    } else if (estSurLeBordDevantCaillou(obtenirPionDevant(pionSelectionne))) {
                        partieFinie();
                    } else { 
                        pousserPionDevant(pionSelectionne);
                    }
                } else if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 2) {
                    if (estSurLeBordDevantPion(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))) {
                        retourPionBanc(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                        pousserPionDevant(pionSelectionne);
                    } else if (estSurLeBordDevantCaillou(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))) {
                        partieFinie();
                    } else {
                        pousserPionDevant(obtenirPionDevant(pionSelectionne));
                        pousserPionDevant(pionSelectionne);
                    }
                } else if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 3) {
                    if (estSurLeBordDevantPion(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))))) {
                        retourPionBanc(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))));
                        pousserPionDevant(obtenirPionDevant(pionSelectionne));
                        pousserPionDevant(pionSelectionne); 
                    } else if (estSurLeBordDevantCaillou(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))))){
                        partieFinie();
                    } else {
                        pousserPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                        pousserPionDevant(obtenirPionDevant(pionSelectionne));
                        pousserPionDevant(pionSelectionne);
                    }
                } else if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 4) {
                    if (estSurLeBordDevantPion(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))))) {
                        retourPionBanc(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))));
                        pousserPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                        pousserPionDevant(obtenirPionDevant(pionSelectionne));
                        pousserPionDevant(pionSelectionne);
                    } else if (estSurLeBordDevantCaillou(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))))) {
                        partieFinie();
                    } else {
                        pousserPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))));
                        pousserPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                        pousserPionDevant(obtenirPionDevant(pionSelectionne));
                        pousserPionDevant(pionSelectionne);
                    }
                } else {
                    console.log('jsp frère c\'est sencé marcher');
                }
            } else {
                console.log('Poussée échouée, pas assez de puissance');
            }

        } else if (obtenirOrientation(pionSelectionne) == 'rotate(180deg)') {
            console.log('Orientation : derriere');
            let orientationInverse = 'rotate(0deg)';

            function compterPuissanceDerriere(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 6) {
                    return puissanceAdversaire;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                        puissanceAdversaire++;
                        return compterPuissanceDerriere(obtenirPionDerriere(regard));
                } else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pionSelectionne)) {
                    puissancePerso += 2;
                    return compterPuissanceDerriere(obtenirPionDerriere(regard));
                } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                    puissanceAdversaire += 2;
                    return compterPuissanceDerriere(obtenirPionDerriere(regard));
                }
            }
            compterPuissanceDerriere(obtenirPionDerriere(pionSelectionne));
            console.log('Puissance adversaire : ', puissanceAdversaire);
            console.log('Puissance perso : ', puissancePerso);

            function nbPiecesDerriere(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    console.log('Caillou trouvé');
                    return compteur + nbPiecesDerriere(obtenirPionDerriere(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    console.log('Pion trouvé');
                    return compteur + nbPiecesDerriere(obtenirPionDerriere(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces derrière : ', nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)));

            function estSurLeBordDerrierePion(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 5 && (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse)) {
                    console.log('un pion est sur le bord');
                    return true;
                }
                return false;
            }

            function estSurLeBordDerriereCaillou(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 6 && regard.getAttribute('couleur') == 'caillou') {
                    console.log('un caillou est sur le bord');
                    return true;
                }
                return false;
            }

            let nombreDePassages = 0;
            function pousserPionDerriere(regard) {
                let pionDerriere = obtenirPionDerriere(regard);
                let pionDerriereDerriere = obtenirPionDerriere(pionDerriere);
                if (nombreDePassages == 0) {
                    if (pionDerriere && pionDerriereDerriere) {
                        pionDerriereDerriere.style.backgroundImage = pionDerriere.style.backgroundImage;
                        pionDerriereDerriere.setAttribute('couleur', pionDerriere.getAttribute('couleur'));
                        pionDerriereDerriere.style.transform = pionDerriere.style.transform;
                        pionDerriereDerriere.setAttribute('case_vide', 'false');
                        pionDerriere.style.backgroundImage = regard.style.backgroundImage;
                        pionDerriere.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDerriere.style.transform = regard.style.transform;
                        pionDerriere.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        nombreDePassages++;
                    } else {
                        retourPionBanc(pionDerriereDerriere);
                        nombreDePassages++;
                    }
                } else {
                    if (pionDerriere) {
                        pionDerriere.style.backgroundImage = regard.style.backgroundImage;
                        pionDerriere.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDerriere.style.transform = regard.style.transform;
                        pionDerriere.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                    }
                }
            }

            if (puissancePerso > puissanceAdversaire) {
                console.log('Poussée réussie');
                if (nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)) == 1) {  
                    if (estSurLeBordDerrierePion(obtenirPionDerriere(pionSelectionne))) {
                        retourPionBanc(obtenirPionDerriere(pionSelectionne));
                    } else if (estSurLeBordDerriereCaillou(obtenirPionDerriere(pionSelectionne))) {
                        partieFinie();
                    } else { 
                        pousserPionDerriere(pionSelectionne);
                    }
                } else if (nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)) == 2) {
                    if (estSurLeBordDerrierePion(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)))) {
                        retourPionBanc(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)));
                        pousserPionDerriere(pionSelectionne);
                    } else if (estSurLeBordDerriereCaillou(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)))) {
                        partieFinie();
                    } else {
                        pousserPionDerriere(obtenirPionDerriere(pionSelectionne));
                        pousserPionDerriere(pionSelectionne);
                    }
                } else if (nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)) == 3) {
                    if (estSurLeBordDerrierePion(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne))))){
                        retourPionBanc(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne))));
                        pousserPionDerriere(obtenirPionDerriere(pionSelectionne));
                        pousserPionDerriere(pionSelectionne);
                    } else if (estSurLeBordDerriereCaillou(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne))))){
                        partieFinie();
                    } else {
                        pousserPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)));
                        pousserPionDerriere(obtenirPionDerriere(pionSelectionne));
                        pousserPionDerriere(pionSelectionne);
                    }
                } else if (nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)) == 4) {
                    if (estSurLeBordDerrierePion(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)))))) {
                        retourPionBanc(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)))));
                        pousserPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)));
                        pousserPionDerriere(obtenirPionDerriere(pionSelectionne));
                        pousserPionDerriere(pionSelectionne);
                    } else if (estSurLeBordDerriereCaillou(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)))))) {
                        partieFinie();
                    } else {
                        pousserPionDerriere(obtenirPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne))));
                        pousserPionDerriere(obtenirPionDerriere(obtenirPionDerriere(pionSelectionne)));
                        pousserPionDerriere(obtenirPionDerriere(pionSelectionne));
                        pousserPionDerriere(pionSelectionne);
                    }
                } else {
                    console.log('jsp frère c\'est sencé marcher');
                }
            } else {
                console.log('Poussée échouée, pas assez de puissance');
            }

        } else if (obtenirOrientation(pionSelectionne) == 'rotate(270deg)') {
            console.log('Orientation : gauche');
            let orientationInverse = 'rotate(90deg)';

            function compterPuissanceGauche(regard) {
                if (regard == null) {
                    return puissanceAdversaire;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                        puissanceAdversaire++;
                        return compterPuissanceGauche(obtenirPionGauche(regard));
                } else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pionSelectionne)) {
                    puissancePerso += 2;
                    return compterPuissanceGauche(obtenirPionGauche(regard));
                } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                    puissanceAdversaire += 2;
                    return compterPuissanceGauche(obtenirPionGauche(regard));
                }
            }
            compterPuissanceGauche(obtenirPionGauche(pionSelectionne));
            console.log('Puissance adversaire : ', puissanceAdversaire);
            console.log('Puissance perso : ', puissancePerso);

            function nbPiecesGauche(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    console.log('Caillou trouvé');
                    return compteur + nbPiecesGauche(obtenirPionGauche(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    console.log('Pion trouvé');
                    return compteur + nbPiecesGauche(obtenirPionGauche(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces à gauche : ', nbPiecesGauche(obtenirPionGauche(pionSelectionne)));

            function estSurLeBordGauchePion(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 1 && (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse)) {
                    console.log('un pion est sur le bord');
                    return true;
                }
                return false;
            }

            function estSurLeBordGaucheCaillou(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 0 && regard.getAttribute('couleur') == 'caillou') {
                    console.log('un caillou est sur le bord');
                    return true;
                }
                return false;
            }

            let nombreDePassages = 0;
            function pousserPionGauche(regard) {
                let pionGauche = obtenirPionGauche(regard);
                let pionGaucheGauche = obtenirPionGauche(pionGauche);
                if (nombreDePassages == 0) {
                    if (pionGauche && pionGaucheGauche) {
                        pionGaucheGauche.style.backgroundImage = pionGauche.style.backgroundImage;
                        pionGaucheGauche.setAttribute('couleur', pionGauche.getAttribute('couleur'));
                        pionGaucheGauche.style.transform = pionGauche.style.transform;
                        pionGaucheGauche.setAttribute('case_vide', 'false');
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        nombreDePassages++;
                    } else {
                        retourPionBanc(pionGaucheGauche);
                        nombreDePassages++;
                    }
                } else {
                    if (pionGauche) {
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                    }
                }
            }

            if (puissancePerso > puissanceAdversaire) {
                console.log('Poussée réussie');
                if (nbPiecesGauche(obtenirPionGauche(pionSelectionne)) == 1) {
                    if (estSurLeBordGauchePion(obtenirPionGauche(pionSelectionne))) {
                        retourPionBanc(obtenirPionGauche(pionSelectionne));
                    } else if (estSurLeBordGaucheCaillou(obtenirPionGauche(pionSelectionne))) {
                        partieFinie();
                    } else {
                        pousserPionGauche(pionSelectionne);
                    }
                } else if (nbPiecesGauche(obtenirPionGauche(pionSelectionne)) == 2) {
                    if (estSurLeBordGauchePion(obtenirPionGauche(obtenirPionGauche(pionSelectionne)))) {
                        retourPionBanc(obtenirPionGauche(obtenirPionGauche(pionSelectionne)));
                        pousserPionGauche(pionSelectionne);
                    } else if (estSurLeBordGaucheCaillou(obtenirPionGauche(obtenirPionGauche(pionSelectionne)))) {
                        partieFinie();
                    } else {
                        pousserPionGauche(obtenirPionGauche(pionSelectionne));
                        pousserPionGauche(pionSelectionne);
                    }
                } else if (nbPiecesGauche(obtenirPionGauche(pionSelectionne)) == 3) {
                    if (estSurLeBordGauchePion(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne))))){
                        retourPionBanc(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne))));
                        pousserPionGauche(obtenirPionGauche(pionSelectionne));
                        pousserPionGauche(pionSelectionne);
                    } else if (estSurLeBordGaucheCaillou(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne))))){
                        partieFinie();
                    } else {
                        pousserPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne)));
                        pousserPionGauche(obtenirPionGauche(pionSelectionne));
                        pousserPionGauche(pionSelectionne);
                    }
                } else if (nbPiecesGauche(obtenirPionGauche(pionSelectionne)) == 4) {
                    if (estSurLeBordGauchePion(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne)))))) {
                        retourPionBanc(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne)))));
                        pousserPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne)));
                        pousserPionGauche(obtenirPionGauche(pionSelectionne));
                        pousserPionGauche(pionSelectionne);
                    } else if (estSurLeBordGaucheCaillou(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne)))))) {
                        partieFinie();
                    } else {
                        pousserPionGauche(obtenirPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne))));
                        pousserPionGauche(obtenirPionGauche(obtenirPionGauche(pionSelectionne)));
                        pousserPionGauche(obtenirPionGauche(pionSelectionne));
                        pousserPionGauche(pionSelectionne);
                    }
                } else {
                    console.log('jsp frère c\'est sencé marcher');
                }
            } else {
                console.log('Poussée échouée, pas assez de puissance');
            }

        } else if (obtenirOrientation(pionSelectionne) == 'rotate(90deg)') {
            console.log('Orientation : droite');
            let orientationInverse = 'rotate(270deg)';

            function compterPuissanceDroite(regard) {
                if (regard == null) {
                    return puissanceAdversaire;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                        puissanceAdversaire++;
                        return compterPuissanceDroite(obtenirPionDroite(regard));
                } else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pionSelectionne)) {
                    puissancePerso += 2;
                    return compterPuissanceDroite(obtenirPionDroite(regard));
                } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                    puissanceAdversaire += 2;
                    return compterPuissanceDroite(obtenirPionDroite(regard));
                }
            }
            compterPuissanceDroite(obtenirPionDroite(pionSelectionne));
            console.log('Puissance adversaire : ', puissanceAdversaire);
            console.log('Puissance perso : ', puissancePerso);

            function nbPiecesDroite(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    console.log('Caillou trouvé');
                    return compteur + nbPiecesDroite(obtenirPionDroite(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    console.log('Pion trouvé');
                    return compteur + nbPiecesDroite(obtenirPionDroite(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces à droite : ', nbPiecesDroite(obtenirPionDroite(pionSelectionne)));
            
            function estSurLeBordDroitePion(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 5 && (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse)) {
                    console.log('un pion est sur le bord');
                    return true;
                }
                return false;
            }

            function estSurLeBordDroiteCaillou(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 6 && regard.getAttribute('couleur') == 'caillou') {
                    console.log('un caillou est sur le bord');
                    return true;
                }
                return false;
            }

            let nombreDePassages = 0;
            function pousserPionDroite(regard) {
                let pionDroite = obtenirPionDroite(regard);
                let pionDroiteDroite = obtenirPionDroite(pionDroite);
                if (nombreDePassages == 0) {
                    if (pionDroite && pionDroiteDroite) {
                        pionDroiteDroite.style.backgroundImage = pionDroite.style.backgroundImage;
                        pionDroiteDroite.setAttribute('couleur', pionDroite.getAttribute('couleur'));
                        pionDroiteDroite.style.transform = pionDroite.style.transform;
                        pionDroiteDroite.setAttribute('case_vide', 'false');
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        nombreDePassages++;
                    } else {
                        retourPionBanc(pionDroiteDroite);
                        nombreDePassages++;
                    }
                } else {
                    if (pionDroite) {
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                    }
                }
            }

            if (puissancePerso > puissanceAdversaire) {
                console.log('Poussée réussie');
                if (nbPiecesDroite(obtenirPionDroite(pionSelectionne)) == 1) {
                    if (estSurLeBordDroitePion(obtenirPionDroite(pionSelectionne))) {
                        retourPionBanc(obtenirPionDroite(pionSelectionne));
                    } else if (estSurLeBordDroiteCaillou(obtenirPionDroite(pionSelectionne))) {
                        partieFinie();
                    } else {
                        pousserPionDroite(pionSelectionne);
                    }
                } else if (nbPiecesDroite(obtenirPionDroite(pionSelectionne)) == 2) {
                    if (estSurLeBordDroitePion(obtenirPionDroite(obtenirPionDroite(pionSelectionne)))) {
                        retourPionBanc(obtenirPionDroite(obtenirPionDroite(pionSelectionne)));
                        pousserPionDroite(pionSelectionne);
                    } else if (estSurLeBordDroiteCaillou(obtenirPionDroite(obtenirPionDroite(pionSelectionne)))) {
                        partieFinie();
                    } else {
                        pousserPionDroite(obtenirPionDroite(pionSelectionne));
                        pousserPionDroite(pionSelectionne);
                    }
                } else if (nbPiecesDroite(obtenirPionDroite(pionSelectionne)) == 3) {
                    if (estSurLeBordDroitePion(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne))))){
                        retourPionBanc(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne))));
                        pousserPionDroite(obtenirPionDroite(pionSelectionne));
                        pousserPionDroite(pionSelectionne);
                    } else if (estSurLeBordDroiteCaillou(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne))))){
                        partieFinie();
                    } else {
                        pousserPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne)));
                        pousserPionDroite(obtenirPionDroite(pionSelectionne));
                        pousserPionDroite(pionSelectionne);
                    }
                } else if (nbPiecesDroite(obtenirPionDroite(pionSelectionne)) == 4) {
                    if (estSurLeBordDroitePion(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne)))))) {
                        retourPionBanc(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne)))));
                        pousserPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne)));
                        pousserPionDroite(obtenirPionDroite(pionSelectionne));
                        pousserPionDroite(pionSelectionne);
                    } else if (estSurLeBordDroiteCaillou(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne)))))) {
                        partieFinie();
                    } else {
                        pousserPionDroite(obtenirPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne))));
                        pousserPionDroite(obtenirPionDroite(obtenirPionDroite(pionSelectionne)));
                        pousserPionDroite(obtenirPionDroite(pionSelectionne));
                        pousserPionDroite(pionSelectionne);
                    }
                } else {
                    console.log('jsp frère c\'est sencé marcher');
                }
            } else {
                console.log('Poussée échouée, pas assez de puissance');
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

    function partieFinie(gagnant) {
        console.log('le couillou est dehors');
        console.log('Le gagnant est : ', gagnant);
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