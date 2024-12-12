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

    function estSurLeBordPion(regard) {
        if (obtenirCoordonnees(regard.id)[0] == 1 && (regard.getAttribute('couleur') == couleur || regard.getAttribute('couleur') == couleurInverse)) {
            console.log('un pion est sur le bord');
            return true;
        }
        return false;
    }

    function estSurLeBordCaillou(regard) {
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
                /*console.log('Avant poussée:', {
                    pionDevantDevantBackground: pionDevantDevant.style.backgroundImage,
                    pionDevantDevantCouleur: pionDevantDevant.getAttribute('couleur'),
                    pionDevantDevantTransform: pionDevantDevant.style.transform,
                    pionDevantBackground: pionDevant.style.backgroundImage,
                    pionDevantCouleur: pionDevant.getAttribute('couleur'),
                    pionDevantTransform: pionDevant.style.transform,
                    regardBackground: regard.style.backgroundImage,
                    regardCouleur: regard.getAttribute('couleur'),
                    regardTransform: regard.style.transform
                });*/
                
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
        
                /*console.log('Après poussée:', {
                    pionDevantDevantBackground: pionDevantDevant.style.backgroundImage,
                    pionDevantDevantCouleur: pionDevantDevant.getAttribute('couleur'),
                    pionDevantDevantTransform: pionDevantDevant.style.transform,
                    pionDevantBackground: pionDevant.style.backgroundImage,
                    pionDevantCouleur: pionDevant.getAttribute('couleur'),
                    pionDevantTransform: pionDevant.style.transform,
                    regardBackground: regard.style.backgroundImage,
                    regardCouleur: regard.getAttribute('couleur'),
                    regardTransform: regard.style.transform
                });*/
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
            if (estSurLeBordPion(obtenirPionDevant(pionSelectionne))) {
                retourPionBanc(obtenirPionDevant(pionSelectionne));
            } else if (estSurLeBordCaillou(obtenirPionDevant(pionSelectionne))) {
                partieFinie();
            } else { 
                pousserPionDevant(pionSelectionne);
            }
        } else if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 2) {
            if (estSurLeBordPion(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))) {
                retourPionBanc(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                pousserPionDevant(pionSelectionne);
            } else if (estSurLeBordCaillou(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))) {
                partieFinie();
            } else {
                pousserPionDevant(obtenirPionDevant(pionSelectionne));
                pousserPionDevant(pionSelectionne);
            }
        } else if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 3) {
            if (estSurLeBordPion(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))))) {
                retourPionBanc(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))));
                pousserPionDevant(obtenirPionDevant(pionSelectionne));
                pousserPionDevant(pionSelectionne); 
            } else if (estSurLeBordCaillou(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne))))){
                partieFinie();
            } else {
                pousserPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                pousserPionDevant(obtenirPionDevant(pionSelectionne));
                pousserPionDevant(pionSelectionne);
            }
        } else if (nbPiecesDevant(obtenirPionDevant(pionSelectionne)) == 4) {
            if (estSurLeBordPion(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))))) {
                retourPionBanc(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))));
                pousserPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)));
                pousserPionDevant(obtenirPionDevant(pionSelectionne));
                pousserPionDevant(pionSelectionne);
            } else if (estSurLeBordCaillou(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(obtenirPionDevant(pionSelectionne)))))) {
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
}