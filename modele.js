console.log("modele chargé");

class Pion {
    constructor(couleur) {
        this.couleur = couleur;
    }
}

class Tableau {
    constructor() {
        this.nb_ligne = 7;
        this.nb_col = 5;
        this.tab = Array(this.nb_ligne).fill().map(() => Array(this.nb_col).fill(0));
    }

    get tab() {
        return this.tab;
    }
}

var tab = new Tableau();
console.log(tab.tab);


var pions_rouge = [];
for (let i = 0; i < nb_col; i++) {
    pions_rouge.push(new Pion("rouge"));
}