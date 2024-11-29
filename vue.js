console.log("vue chargée");

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
          caseElement.id = `case-${i}-${j}`;
          casesContainer.append(caseElement);
      }
  }

  for (let x = 0; x < nb_col; x++) {
    var x_case = document.getElementById(`case-0-${x}`);
    x_case.style.backgroundImage = `url('assets/Rouge${x}.png')`;
    x_case.style.transform = 'rotate(180deg)';
  }
  for (let y = 0; y < nb_col; y++) {
    var y_case = document.getElementById(`case-6-${y}`);
    y_case.style.backgroundImage = `url('assets/Bleu${y}.png')`;
  }

  for (let i = 1; i < 4; i++) {
    var k = aleatoire(1, 4);
    var caillou_case = document.getElementById(`case-3-${i}`);
    caillou_case.style.backgroundImage = `url('assets/Caillou${k}.png')`;
  }
});

function aleatoire (a, b) {
  return Math.round(Math.random() * (b - a) + a)
}

/*
class Case {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  get x() {
    return this.x;
  }

  get y() {
    return this.y;
  }

  set x(x) {
    this.x = x;
  }

  set y(y) {
    this.y = y;
  }

  toString() {
    return `(${this.x}, ${this.y})`;
  }

  equals(c) {
    return this.x == c.x && this.y == c.y;
  }

  distance(c) {
    return Math.abs(this.x - c.x) + Math.abs(this.y - c.y);
  }
}


class Tableau {
  constructor(nb_ligne, nb_col) {
    this.nb_ligne = nb_ligne;
    this.nb_col = nb_col;
    this.tab = [];
  }

  get nb_ligne() {
    return this.nb_ligne;
  }

  get nb_col() {
    return this.nb_col;
  }

  get tab() {
    return this.tab;
  }

  set nb_ligne(nb_ligne) {
    this.nb_ligne = nb_ligne;
  }

  set nb_col(nb_col) {
    this.nb_col = nb_col;
  }

  set tab(tab) {
    this.tab = tab;
  }

  getCase(x, y) {
    return this.tab[x][y];
  }

  setCase(x, y, c) {
    this.tab[x][y] = c;
  }

  toString() {
    let res = "";
    for (let i = 0; i < this.nb_ligne; i++) {
      for (let j = 0; j < this.nb_col; j++) {
        res += this.tab[i][j].toString() + " ";
      }
      res += "\n";
    }
    return res;
  }

  equals(t) {
    if (this.nb_ligne != t.nb_ligne || this.nb_col != t.nb_col) {
      return false;
    }
    for (let i = 0; i < this.nb_ligne; i++) {
      for (let j = 0; j < this.nb_col; j++) {
        if (!this.tab[i][j].equals(t.tab[i][j])) {
          return false;
        }
      }
    }
    return true;
  }

  distance(t) {
    let res = 0;
    for (let i = 0; i < this.nb_ligne; i++) {
      for (let j = 0; j < this.nb_col; j++) {
        res += this.tab[i][j].distance(t.tab[i][j]);
      }
    }
    return res;
  }

  clone() {
    let t = new Tableau(this.nb_ligne, this.nb_col);
    for (let i = 0; i < this.nb_ligne; i++) {
      for (let j = 0; j < this.nb_col; j++) {
        t.tab[i][j] = this.tab[i][j];
      }
    }
    return t;
  }

  estVoisin(c1, c2) {
    return c1.distance(c2) == 1;
  }

  estLibre(c) {
    return this.getCase(c.x, c.y) == null;
  }

  estLibreVoisin(c) {
    return this.estLibre(c) && (c.x == 0 || this.getCase(c.x - 1, c.y) != null || c.x == this.nb_ligne - 1 || this.getCase(c.x + 1, c.y) != null || c.y == 0 || this.getCase(c.x, c.y - 1) != null || c.y == this.nb_col - 1 || this.getCase(c.x, c.y + 1) != null);
  }
}
*/
