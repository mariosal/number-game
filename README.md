Rules
-----

1. Every player has initially 0 points.
2. In each turn a player adds to his sum either the leftmost or the rightmost
element of the array.
3. The player with the greatest sum wins.


Implemention
------------

The bot plays optimally using the
[Minimax](https://en.wikipedia.org/wiki/Minimax) algorithm. The tree is
generated using [dynamic
programming](https://en.wikipedia.org/wiki/Dynamic_programming).
