import { tableau } from './vue.js';
console.log("controller chargé");

const position_mise_en_jeu = [(1, 0), (1, 1), (1, 3), (1, 4), (2, 0), (2, 4), (3, 0), (3, 4), (4, 0), (4, 4), (5, 0), (5, 1), (5, 3), (5, 4)];
const position_banc_rouge = [(0, 0), (0, 1), (0, 2), (0, 3), (0, 4)];
const position_banc_bleu = [(6, 0), (6, 1), (6, 2), (6, 3), (6, 4)];

console.table(tableau)


class Pion {
    constructor(couleur, x, y) {
        this.couleur = couleur;
        this.x = x;
        this.y = y;
        this.position = (x, y);
    }
}