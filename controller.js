console.log("controller chargé");

// ...existing code...

function deplacerPiece(caseElement, nouvellePosition) {
    const anciennePosition = obtenirPositionDepuisId(caseElement.id);
    const piece = { position: anciennePosition };
    mettreAJourAffichage(piece, anciennePosition, nouvellePosition);
    caseElement.id = `case-${nouvellePosition.x}-${nouvellePosition.y}`;
    console.log(`Pièce déplacée à la position ${nouvellePosition}`);
}

// ...existing code...