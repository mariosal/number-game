var minimax = {
  alpha: 0,
  beta: 1,
  a: null,
  n: 0,
  w: null,
  init: function() {
    this.a = new Array(this.n);
    for (var i = 0; i < this.n; ++i) {
      this.a[i] = Math.floor(Math.random()*10 + 1);
    }

    this.w = new Array(this.n);
    for (var i = 0; i < this.n; ++i) {
      this.w[i] = new Array(this.n);
    }

    for (var i = this.n - 1; i >= 0; --i) {
      this.w[i][i] = this.n % 2 != this.alpha ? this.a[i] : 0;
      for (var j = i + 1; j < this.n; ++j) {
        if ((this.n % 2 == 0 && (i + j + 1) % 2 == this.alpha) ||
            (this.n % 2 == 1 && (i + j + 1) % 2 != this.alpha)){
          this.w[i][j] = Math.max(this.a[i] + this.w[i + 1][j],
                                  this.a[j] + this.w[i][j - 1]);
        }
        else {
          this.w[i][j] = Math.min(this.w[i + 1][j],
                                  this.w[i][j - 1]);
        }
      }
    }
  }
};

var behavior = {
  els: null,
  left: 0,
  right: 0,
  player: 0,
  score: [0, 0],
  scoreBoard: null,
  choose: function(id) {
    this.els[id].className = this.getClassName();
    this.score[this.player] += parseInt(this.els[id].innerHTML);
    this.scoreBoard[this.player].innerHTML = this.score[this.player];

    this.left += id == this.left ? 1 : 0;
    this.right -= id == this.right ? 1 : 0;

    if (this.left > this.right) {
      if (this.score[0] > this.score[1]) {
        document.getElementById('win').className = 'show';
      }
      else if (this.score[0] == this.score[1]) {
        document.getElementById('draw').className = 'show';
      }
      else {
        document.getElementById('lose').className = 'show';
      }
    }
  },
  you: function(id) {
    if (id != this.left && id != this.right || this.left > this.right) {
      return;
    }

    this.player = 0;
    this.choose(id);
    this.bot();
  },
  bot: function() {
    if (this.left > this.right) {
      return;
    }

    this.player = 1;
    l = parseInt(this.els[this.left].innerHTML);
    r = parseInt(this.els[this.right].innerHTML);
    if (this.left == this.right) {
      this.choose(this.left);
    }
    else {
      if (l + minimax.w[this.left + 1][this.right] >=
          r + minimax.w[this.left][this.right - 1]) {
        this.choose(this.left);
      }
      else {
        this.choose(this.right);
      }
    }
  },
  getClassName: function() {
    return this.player ? 'red' : 'blue';
  }
};

minimax.n = 10;
minimax.alpha = 0; // Alpha is bot
minimax.beta = 1; // Beta is you
minimax.init();

for (var i = 0; i < minimax.n; ++i) {
  var td = document.createElement('td');
  td.setAttribute('id', i);
  td.innerHTML = minimax.a[i];
  document.getElementsByTagName('tr')[0].appendChild(td);
}

behavior.right = minimax.n - 1;
var els = document.getElementsByTagName('td');
for (el in els) {
  els[el].onclick = function() {
    behavior.you(this.getAttribute('id'));
  }
}
behavior.els = els;
behavior.scoreBoard = [document.getElementById('you'),
                       document.getElementById('bot')];

if (!minimax.alpha) {
  behavior.player = 1;
  behavior.bot()
}
