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

    //Création des cases
    for (let i = 0; i < nb_ligne; i++) {
        for (let j = 0; j < nb_col; j++) {
        const caseElement = document.createElement('div');
        caseElement.classList.add('case');
        caseElement.setAttribute('case_vide', true);
        caseElement.id = `case-${i}-${j}`;
        casesContainer.append(caseElement);
        }
    }

    //Initialisation des cases rouges
    for (let x = 0; x < nb_col; x++) {
        var x_case = document.getElementById(`case-0-${x}`);
        x_case.style.backgroundImage = `url('assets/Rouge${x}.png')`;
        x_case.style.transform = 'rotate(180deg)';
        x_case.dataset.rotation = '180';
        x_case.setAttribute('couleur', 'rouge');
        x_case.setAttribute('case_vide', false);
    }

    //Initialisation des cases bleues
    for (let y = 0; y < nb_col; y++) {
        var y_case = document.getElementById(`case-6-${y}`);
        y_case.style.backgroundImage = `url('assets/Bleu${y}.png')`;
        y_case.style.transform = 'rotate(0deg)';
        y_case.dataset.rotation = '0';
        y_case.setAttribute('couleur', 'bleu');
        y_case.setAttribute('case_vide', false);
    }

    //Initialisation des cailloux
    for (let i = 1; i < 4; i++) {
        var k = aleatoire(1, 4);
        var caillou_case = document.getElementById(`case-3-${i}`);
        caillou_case.style.backgroundImage = `url('assets/Caillou${k}.png')`;
        caillou_case.setAttribute('couleur', 'caillou');
        caillou_case.setAttribute('case_vide', false);
    }


    //Préparations des constantes de variables
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
  
    //Fonction pour marquer les casses accessibles pour la mise en jeu d'une pièce
    function marquerMiseEnJeu(pion, color, cases) {
        cases.forEach(([x, y]) => {
            const caseElement = document.getElementById(`case-${x}-${y}`);
            if (caseElement) {
                caseElement.style.backgroundColor = color;
            }
        });
    }

    //Fonction pour marquer les deux cases inaccessibles au début de la partie
    function marquerCasesInaccessibles(cases, image, isEmpty) {
        cases.forEach(([x, y]) => {
            const caseElement = document.getElementById(`case-${x}-${y}`);
            if (caseElement) {
                caseElement.style.backgroundImage = image;
                caseElement.setAttribute('case_vide', isEmpty);
            }
        });
    }

    //Fonction pour enlever les bordures des pions
    function enleverBordures() {
        Array.from(pions).forEach(pion => {
            pion.style.border = 'none';
        });
    }

    //Fonction pour gérer le retour d'un pion dans son banc
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

    //Action du premier click
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

    //Action du second click
    function SecondClick (pion) {
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
                pionSelectionne.style.border = 'none';
                pionSelectionne = null;
                click1Done = false;
                pion = null
            }
        } else {
            //FAIRE LA POUSSÉE EN INSSERTION ICI
            console.log("Vous vous apprêtez a faire une poussée en insertion !");
            if (peutFairePousséeInsertion(pion)) {
                console.log("La poussée en insertion est possible !");
                pousserInsertion(pion, pionSelectionne);
            }

        }
    }

    function peutFairePousséeInsertion(pion) {
        const coordPion = obtenirCoordonnees(pion.id);
        const bordGauche = [[2, 0], [3, 0], [4, 0]];
        const bordDroit = [[2, 4], [3, 4], [4, 4]];
        const bordHaut = [[1, 1], [1, 2], [1, 3]];
        const bordBas = [[5, 1], [5, 2], [5, 3]];
        const couleur = pion.getAttribute('couleur');
        let puissancePerso = 2;
        let puissanceAdversaire = 0;

        if (pion.getAttribute('case_vide') == 'false') {
            console.log("La case est bien occupée par un pion");
            if (appartientALaListe(coordPion, bordDroit)) {
                console.log("Le bord est le bord droit");
                let orientationInverse = 'rotate(90deg)';

                function compterPuissanceGauche(regard) {
                    if (obtenirCoordonnees(regard.id)[1] == 0) {
                        return puissanceAdversaire;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                            puissanceAdversaire++;
                            return compterPuissanceGauche(obtenirPionGauche(regard));
                    }
                    else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pion)) {
                        puissancePerso += 2;
                        return compterPuissanceGauche(obtenirPionGauche(regard));
                    } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                        puissanceAdversaire += 2;
                        return compterPuissanceGauche(obtenirPionGauche(regard));
                    }
                }
                compterPuissanceGauche(pion);
                console.log('puissancePerso', puissancePerso);
                console.log('puissanceAdversaire', puissanceAdversaire);
                
                if (puissancePerso > puissanceAdversaire) {
                    console.log('la poussée est possible');
                    return true;
                } else {
                    return false;
                }
            } else if (appartientALaListe(coordPion, bordGauche)) {
                console.log("Le bord est le bord gauche");
                let orientationInverse = 'rotate(270deg)';

                function compterPuissanceDroite(regard) {
                    if (obtenirCoordonnees(regard.id)[1] == 4) {
                        return puissanceAdversaire;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                            puissanceAdversaire++;
                            return compterPuissanceDroite(obtenirPionDroite(regard));
                    }
                    else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pion)) {
                        puissancePerso += 2;
                        return compterPuissanceDroite(obtenirPionDroite(regard));
                    } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                        puissanceAdversaire += 2;
                        return compterPuissanceDroite(obtenirPionDroite(regard));
                    }
                }
                compterPuissanceDroite(pion);

                if (puissancePerso > puissanceAdversaire) {
                    console.log('la poussée est possible');
                    return true;
                } else {
                    return false;
                }
            } else if (appartientALaListe(coordPion, bordHaut)) {
                console.log("Le bord est le bord haut");
                let orientationInverse = 'rotate(180deg)';

                function compterPuissanceBas(regard) {
                    if (obtenirCoordonnees(regard.id)[0] == 6) {
                        return puissanceAdversaire;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                            puissanceAdversaire++;
                            return compterPuissanceBas(obtenirPionDerriere(regard));
                    }
                    else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pion)) {
                        puissancePerso += 2;
                        return compterPuissanceBas(obtenirPionDerriere(regard));
                    } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                        puissanceAdversaire += 2;
                        return compterPuissanceBas(obtenirPionDerriere(regard));
                    }
                }
                compterPuissanceBas(pion);

                if (puissancePerso > puissanceAdversaire) {
                    console.log('la poussée est possible');
                    return true;
                } else {
                    return false;
                }
            } else if (appartientALaListe(coordPion, bordBas)) {
                console.log("Le bord est le bord bas");
                let orientationInverse = 'rotate(0deg)';

                function compterPuissanceHaut(regard) {
                    if (obtenirCoordonnees(regard.id)[0] == 0) {
                        return puissanceAdversaire;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                            puissanceAdversaire++;
                            return compterPuissanceHaut(obtenirPionDevant(regard));
                    }
                    else if (regard.getAttribute('couleur') == couleur && obtenirOrientation(regard) == obtenirOrientation(pion)) {
                        puissancePerso += 2;
                        return compterPuissanceHaut(obtenirPionDevant(regard));
                    } else if (regard.getAttribute('couleur') != couleur && obtenirOrientation(regard) == orientationInverse) {
                        puissanceAdversaire += 2;
                        return compterPuissanceHaut(obtenirPionDevant(regard));
                    }
                }
                compterPuissanceHaut(pion);

                if (puissancePerso > puissanceAdversaire) {
                    console.log('la poussée est possible');
                    return true;
                } else {
                    return false;
                }
            } else {
                console.log('Le suicide n\'est plus une option');
                return false;
            }

        }
    }

    function pousserInsertion(pion, pionSelectionne) {
        const bordGauche = [[2, 0], [3, 0], [4, 0]];
        const bordDroit = [[2, 4], [3, 4], [4, 4]];
        const bordHaut = [[1, 1], [1, 2], [1, 3]];
        const bordBas = [[5, 1], [5, 2], [5, 3]];
        let couleur = pionSelectionne.getAttribute('couleur');
        let couleurInverse = couleur === 'rouge' ? 'bleu' : 'rouge';
        console.log(pion.id);
        if (appartientALaListe(obtenirCoordonnees(pion.id), bordDroit)) {
            //Orientation a gauche

            function nbPieceGauche(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPieceGauche(obtenirPionGauche(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur++;
                    return compteur + nbPieceGauche(obtenirPionGauche(regard));
                }
                return compteur;
            }

            let nombreDePassages = 0;
            function pousserPionGauche(regard) {
                let pionGauche = obtenirPionGauche(regard);
                let pionGaucheGauche = obtenirPionGauche(pionGauche);
                if (nombreDePassages == 0) {
                    if (pionGauche && pionGaucheGauche) {
                        if (pionGaucheGauche != null) {
                            console.log('pionGaucheGauche trouvé et non nul');
                            pionGaucheGauche.style.backgroundImage = pionGauche.style.backgroundImage;
                            pionGaucheGauche.setAttribute('couleur', pionGauche.getAttribute('couleur'));
                            pionGaucheGauche.style.transform = pionGauche.style.transform;
                            pionGaucheGauche.setAttribute('case_vide', 'false');
                        }
                        console.log('cas 1');
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(270deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                        nombreDePassages++;
                    } else  if (pionGauche) {
                        console.log('cas 1 bis');
                        nombreDePassages++;
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(270deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                } else {
                    if (pionGauche) {
                        console.log('cas 2');
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(270deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                }
            }

            function faireSiPossibleSortirGauche(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 1) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserGauche(pion, nbPieceGauche) {
                if (nbPieceGauche == 0) {
                    console.log('Il n\'y a pas de pièce à gauche');
                    return;
                } else if (nbPieceGauche == 1) {
                    let pionGauche = obtenirPionGauche(pion);
                    if (pionGauche != null) {
                        console.log('MAIS PORQUOI');
                        faireSiPossibleSortirGauche(pionGauche);
                        pousserPionGauche(pion);
                    } else {
                        console.log('Erreur: pionGauche est null');
                        console.log('pionGauche', pionGauche);
                    }
                } else if (nbPieceGauche == 2) {
                    let pionGauche = obtenirPionGauche(pion);
                    let pionGauche2 = obtenirPionGauche(pionGauche);
                    if (pionGauche != null && pionGauche2 != null) {
                        faireSiPossibleSortirGauche(pionGauche2);
                        pousserPionGauche(pionGauche);
                        pousserPionGauche(pion);
                    } else {
                        console.log('Erreur: pionGauche ou pionGauche2 est null');
                        console.log('pionGauche', pionGauche);
                        console.log('pionGauche2', pionGauche2);
                    }
                } else if (nbPieceGauche == 3) {
                    let pionGauche = obtenirPionGauche(pion);
                    let pionGauche2 = obtenirPionGauche(pionGauche);
                    let pionGauche3 = obtenirPionGauche(pionGauche2);
                    if (pionGauche != null && pionGauche2 != null && pionGauche3 != null) {
                        faireSiPossibleSortirGauche(pionGauche3);
                        pousserPionGauche(pionGauche2);
                        pousserPionGauche(pionGauche);
                        pousserPionGauche(pion);
                    } else {
                        console.log('Erreur: pionGauche, pionGauche2 ou pionGauche3 est null');
                        console.log('pionGauche', pionGauche);
                        console.log('pionGauche2', pionGauche2);
                        console.log('pionGauche3', pionGauche3);
                    }
                } else if (nbPieceGauche == 4) {
                    let pionGauche = obtenirPionGauche(pion);
                    let pionGauche2 = obtenirPionGauche(pionGauche);
                    let pionGauche3 = obtenirPionGauche(pionGauche2);
                    let pionGauche4 = obtenirPionGauche(pionGauche3);
                    if (pionGauche != null && pionGauche2 != null && pionGauche3 != null && pionGauche4 != null) {
                        faireSiPossibleSortirGauche(pionGauche4);
                        pousserPionGauche(pionGauche3);
                        pousserPionGauche(pionGauche2);
                        pousserPionGauche(pionGauche);
                        pousserPionGauche(pion);
                    } else {
                        console.log('Erreur: pionGauche, pionGauche2, pionGauche3 ou pionGauche4 est null');
                        console.log('pionGauche', pionGauche);
                        console.log('pionGauche2', pionGauche2);
                        console.log('pionGauche3', pionGauche3);
                        console.log('pionGauche4', pionGauche4);
                    }
                }
            }
            mainPousserGauche(pion, nbPieceGauche(pion));
            return;

        } else if (appartientALaListe(obtenirCoordonnees(pion.id), bordGauche)) {
            //Orientation à droite

            function nbPieceDroite(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPieceDroite(obtenirPionDroite(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur++;
                    return compteur + nbPieceDroite(obtenirPionDroite(regard));
                }
                return compteur;
            }

            let nombreDePassages = 0;
            function pousserPionDroite(regard) {
                let pionDroite = obtenirPionDroite(regard);
                let pionDroiteDroite = obtenirPionDroite(pionDroite);
                if (nombreDePassages == 0) {
                    if (pionDroite && pionDroiteDroite) {
                        if (pionDroiteDroite != null) {
                            console.log('pionDroiteDroite trouvé et non nul');
                            pionDroiteDroite.style.backgroundImage = pionDroite.style.backgroundImage;
                            pionDroiteDroite.setAttribute('couleur', pionDroite.getAttribute('couleur'));
                            pionDroiteDroite.style.transform = pionDroite.style.transform;
                            pionDroiteDroite.setAttribute('case_vide', 'false');
                        }
                        console.log('cas 1');
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(90deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                        nombreDePassages++;
                    } else  if (pionDroite) {
                        console.log('cas 1 bis');
                        nombreDePassages++;
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(90deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                } else {
                    if (pionDroite) {
                        console.log('cas 2');
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(90deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                }
            }

            function faireSiPossibleSortirDroite(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 3) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserDroite(pion, nbPieceDroite) {
                if (nbPieceDroite == 0) {
                    console.log('Il n\'y a pas de pièce à droite');
                    return;
                } else if (nbPieceDroite == 1) {
                    let pionDroite = obtenirPionDroite(pion);
                    if (pionDroite != null) {
                        console.log('MAIS PORQUOI');
                        faireSiPossibleSortirDroite(pionDroite);
                        pousserPionDroite(pion);
                    } else {
                        console.log('Erreur: pionDroite est null');
                        console.log('pionDroite', pionDroite);
                    }
                } else if (nbPieceDroite == 2) {
                    let pionDroite = obtenirPionDroite(pion);
                    let pionDroite2 = obtenirPionDroite(pionDroite);
                    if (pionDroite != null && pionDroite2 != null) {
                        faireSiPossibleSortirDroite(pionDroite2);
                        pousserPionDroite(pionDroite);
                        pousserPionDroite(pion);
                    } else {
                        console.log('Erreur: pionDroite ou pionDroite2 est null');
                        console.log('pionDroite', pionDroite);
                        console.log('pionDroite2', pionDroite2);
                    }
                } else if (nbPieceDroite == 3) {
                    let pionDroite = obtenirPionDroite(pion);
                    let pionDroite2 = obtenirPionDroite(pionDroite);
                    let pionDroite3 = obtenirPionDroite(pionDroite2);
                    if (pionDroite != null && pionDroite2 != null && pionDroite3 != null) {
                        faireSiPossibleSortirDroite(pionDroite3);
                        pousserPionDroite(pionDroite2);
                        pousserPionDroite(pionDroite);
                        pousserPionDroite(pion);
                    } else {
                        console.log('Erreur: pionDroite, pionDroite2 ou pionDroite3 est null');
                        console.log('pionDroite', pionDroite);
                        console.log('pionDroite2', pionDroite2);
                        console.log('pionDroite3', pionDroite3);
                    }
                } else if (nbPieceDroite == 4) {
                    let pionDroite = obtenirPionDroite(pion);
                    let pionDroite2 = obtenirPionDroite(pionDroite);
                    let pionDroite3 = obtenirPionDroite(pionDroite2);
                    let pionDroite4 = obtenirPionDroite(pionDroite3);
                    if (pionDroite != null && pionDroite2 != null && pionDroite3 != null && pionDroite4 != null) {
                        faireSiPossibleSortirDroite(pionDroite4);
                        pousserPionDroite(pionDroite3);
                        pousserPionDroite(pionDroite2);
                        pousserPionDroite(pionDroite);
                        pousserPionDroite(pion);
                    } else {
                        console.log('Erreur: pionDroite, pionDroite2, pionDroite3 ou pionDroite4 est null');
                        console.log('pionDroite', pionDroite);
                        console.log('pionDroite2', pionDroite2);
                        console.log('pionDroite3', pionDroite3);
                        console.log('pionDroite4', pionDroite4);
                    }
                }
            }
            mainPousserDroite(pion, nbPieceDroite(pion));
            return;

        } else if (appartientALaListe(obtenirCoordonnees(pion.id), bordHaut)) {
            //Orientation en bas

            function nbPieceBas(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPieceBas(obtenirPionDerriere(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur++;
                    return compteur + nbPieceBas(obtenirPionDerriere(regard));
                }
                return compteur;
            }

            let nombreDePassages = 0;
            function pousserPionBas(regard) {
                let pionBas = obtenirPionDerriere(regard);
                let pionBasBas = obtenirPionDerriere(pionBas);
                if (nombreDePassages == 0) {
                    if (pionBas && pionBasBas) {
                        if (pionBasBas != null) {
                            console.log('pionBasBas trouvé et non nul');
                            pionBasBas.style.backgroundImage = pionBas.style.backgroundImage;
                            pionBasBas.setAttribute('couleur', pionBas.getAttribute('couleur'));
                            pionBasBas.style.transform = pionBas.style.transform;
                            pionBasBas.setAttribute('case_vide', 'false');
                        }
                        console.log('cas 1');
                        pionBas.style.backgroundImage = regard.style.backgroundImage;
                        pionBas.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionBas.style.transform = regard.style.transform;
                        pionBas.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(180deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                        nombreDePassages++;
                    } else  if (pionBas) {
                        console.log('cas 1 bis');
                        nombreDePassages++;
                        pionBas.style.backgroundImage = regard.style.backgroundImage;
                        pionBas.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionBas.style.transform = regard.style.transform;
                        pionBas.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(180deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                } else {
                    if (pionBas) {
                        console.log('cas 2');
                        pionBas.style.backgroundImage = regard.style.backgroundImage;
                        pionBas.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionBas.style.transform = regard.style.transform;
                        pionBas.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(180deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                }
            }

            function faireSiPossibleSortirBas(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 4) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserBas(pion, nbPieceBas) {
                if (nbPieceBas == 0) {
                    console.log('Il n\'y a pas de pièce en bas');
                    return;
                } else if (nbPieceBas == 1) {
                    let pionBas = obtenirPionDerriere(pion);
                    if (pionBas != null) {
                        console.log('MAIS PORQUOI');
                        faireSiPossibleSortirBas(pionBas);
                        pousserPionBas(pion);
                    } else {
                        console.log('Erreur: pionBas est null');
                        console.log('pionBas', pionBas);
                    }
                } else if (nbPieceBas == 2) {
                    let pionBas = obtenirPionDerriere(pion);
                    let pionBas2 = obtenirPionDerriere(pionBas);
                    if (pionBas != null && pionBas2 != null) {
                        faireSiPossibleSortirBas(pionBas2);
                        pousserPionBas(pionBas);
                        pousserPionBas(pion);
                    } else {
                        console.log('Erreur: pionBas ou pionBas2 est null');
                        console.log('pionBas', pionBas);
                        console.log('pionBas2', pionBas2);
                    }
                } else if (nbPieceBas == 3) {
                    let pionBas = obtenirPionDerriere(pion);
                    let pionBas2 = obtenirPionDerriere(pionBas);
                    let pionBas3 = obtenirPionDerriere(pionBas2);
                    if (pionBas != null && pionBas2 != null && pionBas3 != null) {
                        faireSiPossibleSortirBas(pionBas3);
                        pousserPionBas(pionBas2);
                        pousserPionBas(pionBas);
                        pousserPionBas(pion);
                    } else {
                        console.log('Erreur: pionBas, pionBas2 ou pionBas3 est null');
                        console.log('pionBas', pionBas);
                        console.log('pionBas2', pionBas2);
                        console.log('pionBas3', pionBas3);
                    }
                } else if (nbPieceBas == 4) {
                    let pionBas = obtenirPionDerriere(pion);
                    let pionBas2 = obtenirPionDerriere(pionBas);
                    let pionBas3 = obtenirPionDerriere(pionBas2);
                    let pionBas4 = obtenirPionDerriere(pionBas3);
                    if (pionBas != null && pionBas2 != null && pionBas3 != null && pionBas4 != null) {
                        faireSiPossibleSortirBas(pionBas4);
                        pousserPionBas(pionBas3);
                        pousserPionBas(pionBas2);
                        pousserPionBas(pionBas);
                        pousserPionBas(pion);
                    } else {
                        console.log('Erreur: pionBas, pionBas2, pionBas3 ou pionBas4 est null');
                        console.log('pionBas', pionBas);
                        console.log('pionBas2', pionBas2);
                        console.log('pionBas3', pionBas3);
                        console.log('pionBas4', pionBas4);
                    }
                }
            }
            mainPousserBas(pion, nbPieceBas(pion));
            return;

        } else if (appartientALaListe(obtenirCoordonnees(pion.id), bordBas)) {
            //Orientation en haut

            function nbPieceHaut(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPieceHaut(obtenirPionDevant(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur++;
                    return compteur + nbPieceHaut(obtenirPionDevant(regard));
                }
                return compteur;
            }

            let nombreDePassages = 0;
            function pousserPionHaut(regard) {
                let pionHaut = obtenirPionDevant(regard);
                let pionHautHaut = obtenirPionDevant(pionHaut);
                if (nombreDePassages == 0) {
                    if (pionHaut && pionHautHaut) {
                        if (pionHautHaut != null) {
                            console.log('pionHautHaut trouvé et non nul');
                            pionHautHaut.style.backgroundImage = pionHaut.style.backgroundImage;
                            pionHautHaut.setAttribute('couleur', pionHaut.getAttribute('couleur'));
                            pionHautHaut.style.transform = pionHaut.style.transform;
                            pionHautHaut.setAttribute('case_vide', 'false');
                        }
                        console.log('cas 1');
                        pionHaut.style.backgroundImage = regard.style.backgroundImage;
                        pionHaut.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionHaut.style.transform = regard.style.transform;
                        pionHaut.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(0deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                        nombreDePassages++;
                    } else  if (pionHaut) {
                        console.log('cas 1 bis');
                        nombreDePassages++;
                        pionHaut.style.backgroundImage = regard.style.backgroundImage;
                        pionHaut.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionHaut.style.transform = regard.style.transform;
                        pionHaut.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(0deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                } else {
                    if (pionHaut) {
                        console.log('cas 2');
                        pionHaut.style.backgroundImage = regard.style.backgroundImage;
                        pionHaut.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionHaut.style.transform = regard.style.transform;
                        pionHaut.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = pionSelectionne.style.backgroundImage;
                        regard.setAttribute('couleur', pionSelectionne.getAttribute('couleur'));
                        regard.style.transform = 'rotate(0deg)';
                        regard.setAttribute('case_vide', 'false');
                        pionSelectionne.style.border = 'none';
                        pionSelectionne.style.backgroundImage = null;
                        pionSelectionne.setAttribute('case_vide', 'true');
                        pionSelectionne.setAttribute('couleur', null);
                        pionSelectionne.style.transform = '';
                    }
                }
            }

            function faireSiPossibleSortirHaut(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 0) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserHaut(pion, nbPieceHaut) {
                if (nbPieceHaut == 0) {
                    console.log('Il n\'y a pas de pièce en haut');
                    return;
                } else if (nbPieceHaut == 1) {
                    let pionHaut = obtenirPionDevant(pion);
                    if (pionHaut != null) {
                        console.log('MAIS PORQUOI');
                        faireSiPossibleSortirHaut(pionHaut);
                        pousserPionHaut(pion);
                    } else {
                        console.log('Erreur: pionHaut est null');
                        console.log('pionHaut', pionHaut);
                    }
                } else if (nbPieceHaut == 2) {
                    let pionHaut = obtenirPionDevant(pion);
                    let pionHaut2 = obtenirPionDevant(pionHaut);
                    if (pionHaut != null && pionHaut2 != null) {
                        faireSiPossibleSortirHaut(pionHaut2);
                        pousserPionHaut(pionHaut);
                        pousserPionHaut(pion);
                    } else {
                        console.log('Erreur: pionHaut ou pionHaut2 est null');
                        console.log('pionHaut', pionHaut);
                        console.log('pionHaut2', pionHaut2);
                    }
                } else if (nbPieceHaut == 3) {
                    let pionHaut = obtenirPionDevant(pion);
                    let pionHaut2 = obtenirPionDevant(pionHaut);
                    let pionHaut3 = obtenirPionDevant(pionHaut2);
                    if (pionHaut != null && pionHaut2 != null && pionHaut3 != null) {
                        faireSiPossibleSortirHaut(pionHaut3);
                        pousserPionHaut(pionHaut2);
                        pousserPionHaut(pionHaut);
                        pousserPionHaut(pion);
                    } else {
                        console.log('Erreur: pionHaut, pionHaut2 ou pionHaut3 est null');
                        console.log('pionHaut', pionHaut);
                        console.log('pionHaut2', pionHaut2);
                        console.log('pionHaut3', pionHaut3);
                    }
                } else if (nbPieceHaut == 4) {
                    let pionHaut = obtenirPionDevant(pion);
                    let pionHaut2 = obtenirPionDevant(pionHaut);
                    let pionHaut3 = obtenirPionDevant(pionHaut2);
                    let pionHaut4 = obtenirPionDevant(pionHaut3);
                    if (pionHaut != null && pionHaut2 != null && pionHaut3 != null && pionHaut4 != null) {
                        faireSiPossibleSortirHaut(pionHaut4);
                        pousserPionHaut(pionHaut3);
                        pousserPionHaut(pionHaut2);
                        pousserPionHaut(pionHaut);
                        pousserPionHaut(pion);
                    } else {
                        console.log('Erreur: pionHaut, pionHaut2, pionHaut3 ou pionHaut4 est null');
                        console.log('pionHaut', pionHaut);
                        console.log('pionHaut2', pionHaut2);
                        console.log('pionHaut3', pionHaut3);
                        console.log('pionHaut4', pionHaut4);
                    }
                }
            }
            mainPousserHaut(pion, nbPieceHaut(pion));
            return;

        } else  {
            console.log('Erreur: la poussée en insertion n\'est pas possible');
            return;
        }
    }
 
    //Fonction pour changer de joueur actif
    function terminerTour() {
        tourBleu = !tourBleu;
        tourTexte.innerText = tourBleu ? 'Tour: Bleu' : 'Tour: Rouge';
        tourTexte.style.color = tourBleu ? 'blue' : 'red';
        click1Done = false;
        enleverBordures();
        pionSelectionne = null;
    }

    //Si le premier click est fait, on appelle la fonction pour le sencond click
    Array.from(pions).forEach(pion => {
        pion.addEventListener('click', (event) => {
            if (!click1Done) {
                PermierClickk(pion);
            } else {
                SecondClick (pion);
            }
        });
    });

    const tourTexte = document.createElement('div');
    tourTexte.id = 'tour-texte';
    tourTexte.innerText = tourBleu ? 'Tour: Bleu' : 'Tour: Rouge';
    tourTexte.style.color = tourBleu ? 'blue' : 'red';
    rotationContainer.appendChild(tourTexte);

    //Création des boutons de rotation et de leurs actions
    const orientations = {devant: '0', droite: '90', arriere: '180', gauche: '270'};
    Object.keys(orientations).forEach(orientation => {
        const button = document.createElement('button');
        button.innerText = orientation;
        button.classList.add('rotation-button');
        button.style.gridArea = orientation;
        button.addEventListener('click', () => {
            if (pionSelectionne && !vientDeBouger) {
                if (tourBleu && pionSelectionne.getAttribute('couleur') === 'bleu' || !tourBleu && pionSelectionne.getAttribute('couleur') === 'rouge') {
                    console.log(`Orientation choisie : ${orientations[orientation]}°`);
                    pionSelectionne.style.transform = `rotate(${orientations[orientation]}deg)`;
                    terminerTour();
                } else {
                    console.log("Ce n'est pas votre tour");
                }
            } else if (vientDeBouger) {
                console.log(`Orientation choisie : ${orientations[orientation]}°`);
                pionRef.style.transform = `rotate(${orientations[orientation]}deg)`;
                vientDeBouger = false;
                terminerTour();
            }
        });
        rotationContainer.appendChild(button);
    });

    //Création du bouton pour terminer le tour
    const finishButton = document.createElement('button');
    finishButton.innerText = 'Terminer';
    finishButton.id = 'finish-button';
    finishButton.classList.add('rotation-button');
    finishButton.addEventListener('click', () => {
        console.log('Tour terminé');
        terminerTour();
    });
    rotationContainer.appendChild(finishButton);

    //Création du bouton pour faire sortir un pion
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

    //Création du bouton pour pousser un pion et toutes les fonctions associées
    const pousserButton = document.createElement('button');
    pousserButton.innerText = 'Pousser';
    pousserButton.id = 'pousser-button';
    pousserButton.classList.add('rotation-button');
    pousserButton.addEventListener('click', () => {
        let puissancePerso = 2;
        let puissanceAdversaire = 0;
        const couleur = pionSelectionne.getAttribute('couleur');
        const couleurInverse = couleur === 'rouge' ? 'bleu' : 'rouge';

        //Premier cas : si la pièce est orientée vers le haut
        if (obtenirOrientation(pionSelectionne) == 'rotate(0deg)') {
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

            function nbPiecesDevant(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPiecesDevant(obtenirPionDevant(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    return compteur + nbPiecesDevant(obtenirPionDevant(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces devant : ', nbPiecesDevant(obtenirPionDevant(pionSelectionne)));

            function estDansBanc(regard) {
                const coordonnees = obtenirCoordonnees(regard.id);
                if (appartientALaListe(coordonnees, position_banc_rouge) || appartientALaListe(coordonnees, position_banc_bleu)) {
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
                        if (!estDansBanc(pionDevantDevant)) {                       
                            pionDevantDevant.style.backgroundImage = pionDevant.style.backgroundImage;
                            pionDevantDevant.setAttribute('couleur', pionDevant.getAttribute('couleur'));
                            pionDevantDevant.style.transform = pionDevant.style.transform;
                            pionDevantDevant.setAttribute('case_vide', 'false');
                        }
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

            function faireSiPossibleSortirDevant(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 1) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserDevant(pionSelectionne, nbPieceDevant) {
                if (nbPieceDevant == 0) {
                    console.log('Il n\'y a pas de pièce devant');
                    return;
                } else if (nbPieceDevant == 1) {
                    let pionDevant = obtenirPionDevant(pionSelectionne);
                    if (pionDevant) {
                        if (estDansBanc(pionDevant)) {
                            console.log('Il n\'y a pas de pièce devant');
                            return;
                        } else {
                            faireSiPossibleSortirDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDevant est null');
                        console.log('pionDevant', pionDevant);
                        return;
                    }
                } else if (nbPieceDevant == 2) {
                    let pionDevant = obtenirPionDevant(pionSelectionne);
                    let pionDevant2 = obtenirPionDevant(pionDevant);
                    if (pionDevant && pionDevant2) {
                        if (estDansBanc(pionDevant2)) {
                            console.log('La pièce2 est dans le banc');
                            faireSiPossibleSortirDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        } else {
                            faireSiPossibleSortirDevant(pionDevant2);
                            pousserPionDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDevant ou pionDevant2 est null');
                        console.log('pionDevant', pionDevant);
                        console.log('pionDevant2', pionDevant2);
                        return;
                    }
                } else if (nbPieceDevant == 3) {
                    let pionDevant = obtenirPionDevant(pionSelectionne);
                    let pionDevant2 = obtenirPionDevant(pionDevant);
                    let pionDevant3 = obtenirPionDevant(pionDevant2);
                    if (pionDevant && pionDevant2 && pionDevant3) {
                        if (estDansBanc(pionDevant3)) {
                            console.log('La pièce3 est dans le banc');
                            faireSiPossibleSortirDevant(pionDevant2);
                            pousserPionDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        } else {
                            faireSiPossibleSortirDevant(pionDevant3);
                            pousserPionDevant(pionDevant2);
                            pousserPionDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDevant, pionDevant2 ou pionDevant3 est null');
                        console.log('pionDevant', pionDevant);
                        console.log('pionDevant2', pionDevant2);
                        console.log('pionDevant3', pionDevant3);
                        return;
                    }
                } else if (nbPieceDevant == 4) {
                    let pionDevant = obtenirPionDevant(pionSelectionne);
                    let pionDevant2 = obtenirPionDevant(pionDevant);
                    let pionDevant3 = obtenirPionDevant(pionDevant2);
                    let pionDevant4 = obtenirPionDevant(pionDevant3);
                    if (pionDevant && pionDevant2 && pionDevant3 && pionDevant4) {
                        if (estDansBanc(pionDevant4)) {
                            console.log('La pièce4 est dans le banc');
                            faireSiPossibleSortirDevant(pionDevant3);
                            pousserPionDevant(pionDevant2);
                            pousserPionDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        } else {
                            faireSiPossibleSortirDevant(pionDevant4);
                            pousserPionDevant(pionDevant3);
                            pousserPionDevant(pionDevant2);
                            pousserPionDevant(pionDevant);
                            pousserPionDevant(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDevant, pionDevant2, pionDevant3 ou pionDevant4 est null');
                        console.log('pionDevant', pionDevant);
                        console.log('pionDevant2', pionDevant2);
                        console.log('pionDevant3', pionDevant3);
                        console.log('pionDevant4', pionDevant4);
                        return;
                    }
                } else if (nbPieceDevant == 5) {
                    let pionDevant = obtenirPionDevant(pionSelectionne);
                    let pionDevant2 = obtenirPionDevant(pionDevant);
                    let pionDevant3 = obtenirPionDevant(pionDevant2);
                    let pionDevant4 = obtenirPionDevant(pionDevant3);
                    if (pionDevant && pionDevant2 && pionDevant3 && pionDevant4) {
                        faireSiPossibleSortirDevant(pionDevant4);
                        pousserPionDevant(pionDevant3);
                        pousserPionDevant(pionDevant2);
                        pousserPionDevant(pionDevant);
                        pousserPionDevant(pionSelectionne);
                        return;
                    } else {
                        console.log('Erreur: pionDevant, pionDevant2, pionDevant3 ou pionDevant4 est null');
                        console.log('pionDevant', pionDevant);
                        console.log('pionDevant2', pionDevant2);
                        console.log('pionDevant3', pionDevant3);
                        console.log('pionDevant4', pionDevant4);
                        return;
                    }
                }
            }
            if ((tourBleu && couleur == 'bleu') || (!tourBleu && couleur == 'rouge')) {
                if (puissancePerso > puissanceAdversaire) {
                    console.log('Poussée réussie');
                    mainPousserDevant(pionSelectionne, nbPiecesDevant(obtenirPionDevant(pionSelectionne)));
                    terminerTour();
                }
            } else {
                console.log('Ce n\'est pas votre tour');
            }

        //Deuxième cas : si la pièce est orientée vers le bas
        } else if (obtenirOrientation(pionSelectionne) == 'rotate(180deg)') {
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

            function nbPiecesDerriere(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPiecesDerriere(obtenirPionDerriere(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    return compteur + nbPiecesDerriere(obtenirPionDerriere(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces derrière : ', nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)));

            function estDansBanc(regard) {
                const coordonnees = obtenirCoordonnees(regard.id);
                if (appartientALaListe(coordonnees, position_banc_rouge) || appartientALaListe(coordonnees, position_banc_bleu)) {
                    return true;
                }
                return false;
            }

            let nombreDePassages = 0;
            function pousserPionDerriere(regard) {
                let pionDerriere = obtenirPionDerriere(regard);
                let pionDerriereDerriere = obtenirPionDerriere(pionDerriere);
                if (obtenirCoordonnees(pionDerriereDerriere.id)[0] == 6 && (pionDerriere.getAttribute('couleur') == couleur || pionDerriere.getAttribute('couleur') == couleurInverse)) {
                    console.log('un pion est sur le bord');
                    return;
                }
                if (nombreDePassages == 0) {
                    if (pionDerriere && pionDerriereDerriere) {
                        if (!estDansBanc(pionDerriereDerriere)) {
                            pionDerriereDerriere.style.backgroundImage = pionDerriere.style.backgroundImage;
                            pionDerriereDerriere.setAttribute('couleur', pionDerriere.getAttribute('couleur'));
                            pionDerriereDerriere.style.transform = pionDerriere.style.transform;
                            pionDerriereDerriere.setAttribute('case_vide', 'false');
                        }
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

            function faireSiPossibleSortirDerriere(regard) {
                if (obtenirCoordonnees(regard.id)[0] == 5) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserDerriere(pionSelectionne, nbPieceDerriere) {
                if (nbPieceDerriere == 0) {
                    console.log('Il n\'y a pas de pièce derrière');
                    return;
                } else if (nbPieceDerriere == 1) {
                    let pionDerriere = obtenirPionDerriere(pionSelectionne);
                    if (pionDerriere) {
                        if (estDansBanc(pionDerriere)) {
                            console.log('Il n\'y a pas de pièce derrière');
                            return;
                        } else {
                            faireSiPossibleSortirDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDerriere est null');
                        console.log('pionDerriere', pionDerriere);
                        return;
                    }
                } else if (nbPieceDerriere == 2) {
                    let pionDerriere = obtenirPionDerriere(pionSelectionne);
                    let pionDerriere2 = obtenirPionDerriere(pionDerriere);
                    if (pionDerriere && pionDerriere2) {
                        if (estDansBanc(pionDerriere2)) {
                            console.log('La pièce2 est dans le banc');
                            faireSiPossibleSortirDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        } else {
                            faireSiPossibleSortirDerriere(pionDerriere2);
                            pousserPionDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDerriere ou pionDerriere2 est null');
                        console.log('pionDerriere', pionDerriere);
                        console.log('pionDerriere2', pionDerriere2);
                        return;
                    }
                } else if (nbPieceDerriere == 3) {
                    let pionDerriere = obtenirPionDerriere(pionSelectionne);
                    let pionDerriere2 = obtenirPionDerriere(pionDerriere);
                    let pionDerriere3 = obtenirPionDerriere(pionDerriere2);
                    if (pionDerriere && pionDerriere2 && pionDerriere3) {
                        if (estDansBanc(pionDerriere3)) {
                            console.log('La pièce3 est dans le banc');
                            faireSiPossibleSortirDerriere(pionDerriere2);
                            pousserPionDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        } else {
                            faireSiPossibleSortirDerriere(pionDerriere3);
                            pousserPionDerriere(pionDerriere2);
                            pousserPionDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDerriere, pionDerriere2 ou pionDerriere3 est null');
                        console.log('pionDerriere', pionDerriere);
                        console.log('pionDerriere2', pionDerriere2);
                        console.log('pionDerriere3', pionDerriere3);
                        return;
                    }
                } else if (nbPieceDerriere == 4) {
                    let pionDerriere = obtenirPionDerriere(pionSelectionne);
                    let pionDerriere2 = obtenirPionDerriere(pionDerriere);
                    let pionDerriere3 = obtenirPionDerriere(pionDerriere2);
                    let pionDerriere4 = obtenirPionDerriere(pionDerriere3);
                    if (pionDerriere && pionDerriere2 && pionDerriere3 && pionDerriere4) {
                        if (estDansBanc(pionDerriere4)) {
                            console.log('La pièce4 est dans le banc');
                            faireSiPossibleSortirDerriere(pionDerriere3);
                            pousserPionDerriere(pionDerriere2);
                            pousserPionDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        } else {
                            faireSiPossibleSortirDerriere(pionDerriere4);
                            pousserPionDerriere(pionDerriere3);
                            pousserPionDerriere(pionDerriere2);
                            pousserPionDerriere(pionDerriere);
                            pousserPionDerriere(pionSelectionne);
                            return;
                        }
                    } else {
                        console.log('Erreur: pionDerriere, pionDerriere2, pionDerriere3 ou pionDerriere4 est null');
                        console.log('pionDerriere', pionDerriere);
                        console.log('pionDerriere2', pionDerriere2);
                        console.log('pionDerriere3', pionDerriere3);
                        console.log('pionDerriere4', pionDerriere4);
                        return;
                    }
                } else if (nbPieceDerriere == 5) {
                    let pionDerriere = obtenirPionDerriere(pionSelectionne);
                    let pionDerriere2 = obtenirPionDerriere(pionDerriere);
                    let pionDerriere3 = obtenirPionDerriere(pionDerriere2);
                    let pionDerriere4 = obtenirPionDerriere(pionDerriere3);
                    if (pionDerriere && pionDerriere2 && pionDerriere3 && pionDerriere4) {
                        faireSiPossibleSortirDerriere(pionDerriere4);
                        pousserPionDerriere(pionDerriere3);
                        pousserPionDerriere(pionDerriere2);
                        pousserPionDerriere(pionDerriere);
                        pousserPionDerriere(pionSelectionne);
                        return;
                    } else {
                        console.log('Erreur: pionDerriere, pionDerriere2, pionDerriere3 ou pionDerriere4 est null');
                        console.log('pionDerriere', pionDerriere);
                        console.log('pionDerriere2', pionDerriere2);
                        console.log('pionDerriere3', pionDerriere3);
                        console.log('pionDerriere4', pionDerriere4);
                        return;
                    }
                }
            }

            if ((tourBleu && couleur == 'bleu') || (!tourBleu && couleur == 'rouge')) {
                if (puissancePerso > puissanceAdversaire) {
                    console.log('Poussée réussie');
                    mainPousserDerriere(pionSelectionne, nbPiecesDerriere(obtenirPionDerriere(pionSelectionne)));
                    terminerTour();
                }
            } else {
                console.log('Ce n\'est pas votre tour');
            }

        //Troisième cas : si la pièce est orientée vers la gauche
        } else if (obtenirOrientation(pionSelectionne) == 'rotate(270deg)') {
            let orientationInverse = 'rotate(90deg)';
            
            function compterPuissanceGauche(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 0) {
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

            function nbPiecesGauche(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPiecesGauche(obtenirPionGauche(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    return compteur + nbPiecesGauche(obtenirPionGauche(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces à gauche : ', nbPiecesGauche(obtenirPionGauche(pionSelectionne)));

            let nombreDePassages = 0;
            function pousserPionGauche(regard) {
                let pionGauche = obtenirPionGauche(regard);
                let pionGaucheGauche = obtenirPionGauche(pionGauche);
                if (nombreDePassages == 0) {
                    if (pionGauche && pionGaucheGauche) {
                        if (pionGaucheGauche != null) {
                            console.log('pionGaucheGauche trouvé et non nul');
                            pionGaucheGauche.style.backgroundImage = pionGauche.style.backgroundImage;
                            pionGaucheGauche.setAttribute('couleur', pionGauche.getAttribute('couleur'));
                            pionGaucheGauche.style.transform = pionGauche.style.transform;
                            pionGaucheGauche.setAttribute('case_vide', 'false');
                        }
                        console.log('cas 1');
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        nombreDePassages++;
                    } else  if (pionGauche) {
                        console.log('cas 1 bis');
                        nombreDePassages++;
                        pionGauche.style.backgroundImage = regard.style.backgroundImage;
                        pionGauche.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionGauche.style.transform = regard.style.transform;
                        pionGauche.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        
                    }
                } else {
                    if (pionGauche) {
                        console.log('cas 2');
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

            function faireSiPossibleSortirGauche(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 0) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserGauche(pionSelectionne, nbPieceGauche) {
                if (nbPieceGauche == 0) {
                    console.log('Il n\'y a pas de pièce à gauche');
                    return;
                } else if (nbPieceGauche == 1) {
                    let pionGauche = obtenirPionGauche(pionSelectionne);
                    if (pionGauche != null) {
                        console.log('MAIS PORQUOI');
                        faireSiPossibleSortirGauche(pionGauche);
                        pousserPionGauche(pionSelectionne);
                    } else {
                        console.log('Erreur: pionGauche est null');
                        console.log('pionGauche', pionGauche);
                    }
                } else if (nbPieceGauche == 2) {
                    let pionGauche = obtenirPionGauche(pionSelectionne);
                    let pionGauche2 = obtenirPionGauche(pionGauche);
                    if (pionGauche != null && pionGauche2 != null) {
                        faireSiPossibleSortirGauche(pionGauche2);
                        pousserPionGauche(pionGauche);
                        pousserPionGauche(pionSelectionne);
                    } else {
                        console.log('Erreur: pionGauche ou pionGauche2 est null');
                        console.log('pionGauche', pionGauche);
                        console.log('pionGauche2', pionGauche2);
                    }
                } else if (nbPieceGauche == 3) {
                    let pionGauche = obtenirPionGauche(pionSelectionne);
                    let pionGauche2 = obtenirPionGauche(pionGauche);
                    let pionGauche3 = obtenirPionGauche(pionGauche2);
                    if (pionGauche != null && pionGauche2 != null && pionGauche3 != null) {
                        faireSiPossibleSortirGauche(pionGauche3);
                        pousserPionGauche(pionGauche2);
                        pousserPionGauche(pionGauche);
                        pousserPionGauche(pionSelectionne);
                    } else {
                        console.log('Erreur: pionGauche, pionGauche2 ou pionGauche3 est null');
                        console.log('pionGauche', pionGauche);
                        console.log('pionGauche2', pionGauche2);
                        console.log('pionGauche3', pionGauche3);
                    }
                } else if (nbPieceGauche == 4) {
                    let pionGauche = obtenirPionGauche(pionSelectionne);
                    let pionGauche2 = obtenirPionGauche(pionGauche);
                    let pionGauche3 = obtenirPionGauche(pionGauche2);
                    let pionGauche4 = obtenirPionGauche(pionGauche3);
                    if (pionGauche != null && pionGauche2 != null && pionGauche3 != null && pionGauche4 != null) {
                        faireSiPossibleSortirGauche(pionGauche4);
                        pousserPionGauche(pionGauche3);
                        pousserPionGauche(pionGauche2);
                        pousserPionGauche(pionGauche);
                        pousserPionGauche(pionSelectionne);
                    } else {
                        console.log('Erreur: pionGauche, pionGauche2, pionGauche3 ou pionGauche4 est null');
                        console.log('pionGauche', pionGauche);
                        console.log('pionGauche2', pionGauche2);
                        console.log('pionGauche3', pionGauche3);
                        console.log('pionGauche4', pionGauche4);
                    }
                }
            }

            if ((tourBleu && couleur == 'bleu') || (!tourBleu && couleur == 'rouge')) {
                if (puissancePerso > puissanceAdversaire) {
                    console.log('Poussée réussie');
                    mainPousserGauche(pionSelectionne, nbPiecesGauche(obtenirPionGauche(pionSelectionne)));
                    terminerTour();
                }
            } else {
                console.log('Ce n\'est pas votre tour');
            }

        //Quatrième cas : si la pièce est orientée vers la droite
        } else if (obtenirOrientation(pionSelectionne) == 'rotate(90deg)') {
            let orientationInverse = 'rotate(270deg)';
            
            function compterPuissanceDroite(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 4) {
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

            function nbPiecesDroite(regard, compteur = 0) {
                if (regard == null) {
                    return compteur;
                } else if (regard.getAttribute('couleur') == 'caillou') {
                    compteur++;
                    return compteur + nbPiecesDroite(obtenirPionDroite(regard));
                } else if (regard.getAttribute('couleur') == couleurInverse || regard.getAttribute('couleur') == couleur) {
                    compteur ++;
                    return compteur + nbPiecesDroite(obtenirPionDroite(regard));
                }
                return compteur;
            }
            console.log('Nombre de pièces à droite : ', nbPiecesDroite(obtenirPionDroite(pionSelectionne)));

            let nombreDePassages = 0;
            function pousserPionDroite(regard) {
                let pionDroite = obtenirPionDroite(regard);
                let pionDroiteDroite = obtenirPionDroite(pionDroite);
                if (nombreDePassages == 0) {
                    if (pionDroite && pionDroiteDroite) {
                        if (pionDroiteDroite != null) {
                            console.log('pionDroiteDroite trouvé et non nul');
                            pionDroiteDroite.style.backgroundImage = pionDroite.style.backgroundImage;
                            pionDroiteDroite.setAttribute('couleur', pionDroite.getAttribute('couleur'));
                            pionDroiteDroite.style.transform = pionDroite.style.transform;
                            pionDroiteDroite.setAttribute('case_vide', 'false');
                        }
                        console.log('cas 1');
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        nombreDePassages++;
                    } else  if (pionDroite) {
                        console.log('cas 1 bis');
                        nombreDePassages++;
                        pionDroite.style.backgroundImage = regard.style.backgroundImage;
                        pionDroite.setAttribute('couleur', regard.getAttribute('couleur'));
                        pionDroite.style.transform = regard.style.transform;
                        pionDroite.setAttribute('case_vide', 'false');
                        regard.style.backgroundImage = null;
                        regard.setAttribute('couleur', null);
                        regard.style.transform = '';
                        regard.setAttribute('case_vide', 'true');
                        
                    }
                } else {
                    if (pionDroite) {
                        console.log('cas 2');
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

            function faireSiPossibleSortirDroite(regard) {
                if (obtenirCoordonnees(regard.id)[1] == 4) {
                    if (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse) {
                        retourPionBanc(regard);
                        return;
                    } else if (regard.getAttribute('couleur') == 'caillou') {
                        partieFinie();
                        return;
                    }
                } else {
                    return;
                }
            }

            function mainPousserDroite(pionSelectionne, nbPieceDroite) {
                if (nbPieceDroite == 0) {
                    console.log('Il n\'y a pas de pièce à droite');
                    return;
                } else if (nbPieceDroite == 1) {
                    let pionDroite = obtenirPionDroite(pionSelectionne);
                    if (pionDroite != null) {
                        console.log('MAIS PORQUOI');
                        faireSiPossibleSortirDroite(pionDroite);
                        pousserPionDroite(pionSelectionne);
                    } else {
                        console.log('Erreur: pionDroite est null');
                        console.log('pionDroite', pionDroite);
                    }
                } else if (nbPieceDroite == 2) {
                    let pionDroite = obtenirPionDroite(pionSelectionne);
                    let pionDroite2 = obtenirPionDroite(pionDroite);
                    if (pionDroite != null && pionDroite2 != null) {
                        faireSiPossibleSortirDroite(pionDroite2);
                        pousserPionDroite(pionDroite);
                        pousserPionDroite(pionSelectionne);
                    } else {
                        console.log('Erreur: pionDroite ou pionDroite2 est null');
                        console.log('pionDroite', pionDroite);
                        console.log('pionDroite2', pionDroite2);
                    }
                } else if (nbPieceDroite == 3) {
                    let pionDroite = obtenirPionDroite(pionSelectionne);
                    let pionDroite2 = obtenirPionDroite(pionDroite);
                    let pionDroite3 = obtenirPionDroite(pionDroite2);
                    if (pionDroite != null && pionDroite2 != null && pionDroite3 != null) {
                        faireSiPossibleSortirDroite(pionDroite3);
                        pousserPionDroite(pionDroite2);
                        pousserPionDroite(pionDroite);
                        pousserPionDroite(pionSelectionne);
                    } else {
                        console.log('Erreur: pionDroite, pionDroite2 ou pionDroite3 est null');
                        console.log('pionDroite', pionDroite);
                        console.log('pionDroite2', pionDroite2);
                        console.log('pionDroite3', pionDroite3);
                    }
                } else if (nbPieceDroite == 4) {
                    let pionDroite = obtenirPionDroite(pionSelectionne);
                    let pionDroite2 = obtenirPionDroite(pionDroite);
                    let pionDroite3 = obtenirPionDroite(pionDroite2);
                    let pionDroite4 = obtenirPionDroite(pionDroite3);
                    if (pionDroite != null && pionDroite2 != null && pionDroite3 != null && pionDroite4 != null) {
                        faireSiPossibleSortirDroite(pionDroite4);
                        pousserPionDroite(pionDroite3);
                        pousserPionDroite(pionDroite2);
                        pousserPionDroite(pionDroite);
                        pousserPionDroite(pionSelectionne);
                    } else {
                        console.log('Erreur: pionDroite, pionDroite2, pionDroite3 ou pionDroite4 est null');
                        console.log('pionDroite', pionDroite);
                        console.log('pionDroite2', pionDroite2);
                        console.log('pionDroite3', pionDroite3);
                        console.log('pionDroite4', pionDroite4);
                    }
                }
            }

            if ((tourBleu && couleur == 'bleu') || (!tourBleu && couleur == 'rouge')) {
                if (puissancePerso > puissanceAdversaire) {
                    console.log('Poussée réussie');
                    mainPousserDroite(pionSelectionne, nbPiecesDroite(obtenirPionDroite(pionSelectionne)));
                    terminerTour();
                }
            } else {
                console.log('Ce n\'est pas votre tour');
            }
        }

    });
    rotationContainer.appendChild(pousserButton);

    //Fonction pour obtenir le pion devant
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

    //Fonction pour obtenir le pion derrière
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

    //Fonction pour obtenir le pion à gauche
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
    
    //Fonction pour obtenir le pion à droite
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

    //Fonction qui renvoit la pop up de fin de partie avec le gagnant
    //Cette fonction permet également de recommencer une partie
    function partieFinie(gagnant) {
        console.log('le couillou est dehors');
        console.log('Le gagnant est : ', gagnant);
        
        if (confirm('Le gagnant est : ' + gagnant + '\nVoulez-vous recommencer une partie ?')) {
            location.reload();
        }
    }
    
});

//Fonction alléatoire utilisée dans le choix des cailloux (le choix des caillours est fait alléatoirement entre les 5 assets de cailloux)
function aleatoire (a, b) {
    return Math.round(Math.random() * (b - a) + a)
}

//Fonction pour enlever un élément d'un tableau utilisé pour moddifier les constantes par rapport au nombre de tours passés
function enleverElement(tab, element) {
    const index = tab.findIndex(item => item[0] === element[0] && item[1] === element[1]);
    if (index > -1) {
        tab.splice(index, 1);
    }
    return tab;
}

//Fonction qui renvoit les coordonnées d'un élément passé en paramètre
function obtenirCoordonnees(id) {
    const parts = id.split('-');
    const x = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    return [x, y];
}

//Fonction qui permet de comparer les tableaux, utilisé dans la fonction appartientALaListe
function comparerTableaux(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) return false;
    }
    return true;
}

//Fonction qui renvoit si un élément appartient à une liste (dans notre cas on cherche a savoir si des coordonnées appartiennent à une constante créee auparavant)
function appartientALaListe(coordonnees, liste) {
    for (let i = 0; i < liste.length; i++) {
        if (comparerTableaux(coordonnees, liste[i])) {
            return true;
        }
    }
    return false;
}

//Fonction qui renvoit l'orientation d'un pion
function obtenirOrientation(pion) {
    return pion.style.transform;
}