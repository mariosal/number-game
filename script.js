/**
 * Throws exception if condition == false
 *
 * @param {bool} condition The boolean value to be checked
 * @param {String} description The statement of the exception
 */
var assert = function(condition, description) {
  if (!condition) {
    throw 'Assertion failed: ' + description;
  }
};

/**
 * Computes the tree
 *
 * @param {int*} array Contains the numbers of the game
 * @param {int} bot 1 if bot plays first, else 0
 * @returns {[int*, int**]} The partial sums and the weight tree
 */
var minimax = function(array, bot) {
  assert(typeof array != 'undefined', 'minimax: Undefined array');
  assert(typeof bot != 'undefined', 'minimax: Undefined first player');

  var w = new Array(array.length);
  var sum = new Array(array.length + 1); // Partial sums of array. 1-indexed

  sum[0] = 0;
  for (var i = 0; i < array.length; ++i) {
    sum[i + 1] = sum[i] + array[i];
    w[i] = new Array(array.length);
    w[i][i] = array.length % 2 != bot ? array[i] : 0;
  }

  // Computing the tree
  for (var i = array.length - 1; i >= 0; --i) {
    for (var j = i + 1; j < array.length; ++j) {
      // Note here that the cases of minimising and maximising the weight are
      // symmetrical so there is no need to compute them separately
      w[i][j] = Math.max(sum[j + 1] - sum[i + 1] - w[i + 1][j] + array[i],
                         sum[j] - sum[i] - w[i][j - 1] + array[j]);
    }
  }

  return [sum, w];
};

var behavior = {
  element: null,
  score: [0, 0],
  scoreBoard: null,
  sum: null,
  w: null,

  /**
   * Passes the move to this.select()
   * @param {int} bot 1 if bot plays, else 0
   * @param {int} move The id of the element
   */
  play: function(bot, move) {
    if (this.left > this.right) {
      return;
    }

    if (bot) {
      var l = parseInt(this.element[this.left].innerHTML);
      var r = parseInt(this.element[this.right].innerHTML);

      if (this.left == this.right) { // Avoid overflow
        this.select(bot, this.left);
      }
      else if (l + this.sum[this.right + 1] - this.sum[this.left + 1] -
               this.w[this.left + 1][this.right] >=
               r + this.sum[this.right] - this.sum[this.left] -
               this.w[this.left][this.right - 1]) {
        this.select(bot, this.left);
      }
      else {
        this.select(bot, this.right);
      }
    }
    else {
      assert(typeof move != 'undefined',
             'behavior.select: Undefined move for human');
      if (move != this.left && move != this.right) {
        return;
      }

      this.select(bot, move);
      this.play(1);
    }
  },

  /**
   * Makes a move on the page
   *
   * @param {int} bot 1 if bot plays, else 0
   * @param {int} move The id of the element
   */
  select: function(bot, move) {
    this.element[move].className = bot ? 'red' : 'blue';
    this.score[bot] += parseInt(this.element[move].innerHTML);
    this.scoreBoard[bot].innerHTML = this.score[bot];

    this.left += this.left == move ? 1 : 0;
    this.right -= this.right == move ? 1 : 0;

    if (this.left > this.right) {
      if (this.score[0] > this.score[1]) {
        this.onwin();
      }
      else if (this.score[0] == this.score[1]) {
        this.ondraw();
      }
      else {
        this.onlose();
      }
    }
  },

  onwin: function() {
  },
  ondraw: function() {
  },
  onlose: function() {
  }
};

// Select who plays first
var bot = Math.floor(Math.random()*1000) % 2;

// Generating the numbers
var N = 10;
var array = new Array(N);
for (var i = 0; i < array.length; ++i) {
  array[i] = Math.floor(Math.random()*100) % 16 + 1; // [1..100]
}

// Creating the HTML tags
for (var i = 0; i < array.length; ++i) {
  var td = document.createElement('td');
  td.setAttribute('id', i);
  td.innerHTML = array[i];
  document.getElementsByTagName('tr')[0].appendChild(td);
}

// Configuring behavior
behavior.element = document.getElementsByTagName('td');
behavior.left = 0;
behavior.right = array.length - 1;
behavior.scoreBoard = [document.getElementById('human'),
                       document.getElementById('bot')];
var ret = minimax(array, bot);
behavior.sum = ret[0];
behavior.w = ret[1];

// Defining the events
for (i in behavior.element) {
  behavior.element[i].onclick = function() {
    behavior.play(0, this.getAttribute('id'));
  };
}
behavior.onwin = function() {
  document.getElementById('win').className = 'show';
};
behavior.ondraw = function() {
  document.getElementById('draw').className = 'show';
};
behavior.onlose = function() {
  document.getElementById('lose').className = 'show';
};

// Make a move if bot plays first
if (bot) {
  behavior.play(1);
}
