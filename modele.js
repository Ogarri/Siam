console.log("modele chargé");

let tableau = [];

function initialiserTableau(nb_ligne, nb_col) {
  tableau = new Array(nb_ligne).fill(null).map(() => new Array(nb_col).fill(null));
}

initialiserTableau(7, 5);
console.log(tableau);

