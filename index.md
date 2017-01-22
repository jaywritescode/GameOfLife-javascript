---
pagetitle: Conway's Game of Life
include-after: <link rel="stylesheet" href="style/gh-pages.css">
---

<style type="text/css">
  body {
    position: relative;
  }
</style>

Life
====

<div id="main"></div>

# what is this?

The game of Life is collecting dust in my basement, ever since the spinner fell apart and the ten-year-old me tore up the promissory notes after losing and living out my days in the Poor Farm one too many times. Conway's Game of Life is way cooler than the Milton-Bradley version, a mesmerizing electronic fishbowl and demonstration of often complex, difficult-to-predict behavior emerging from simple rules. It was also an interview question I got at Google maybe five years ago, and that's why it's on my website today.

Life lives on an infinite planar grid with cells in one of two states: alive or dead. The game is seeded with an initial pattern of live cells and transition rule; on each iteration of the game, the transition rule is applied to each cell on the grid and the pattern potentially changes. I forgot to mention that there are no players and certainly no winners in Conway's Game of Life, which is a vast improvement of the game I played as a child.

The transition rule is a function of a cell's current state and the number of live cells in the target cell's _Moore neighborhood_, its eight horizontally, vertically, and diagonally adjacent cells. The rule has two parts, $B,S \subset \{0,1,2,3,4,5,6,7,8,9\}$, which operate as follows:

Let $C_i$ be a cell in in iteration $i$ and let $m$ be the number of live cells in $C$'s Moore neighborhood. Then:

1. If $C_i$ is dead and $m \in B$, then $C_{i+1}$ is alive.

2. Otherwise if $C_i$ is alive and $m \in S$, then $C_{i+1}$ is alive.

3. Otherwise $C_{i+1}$ is dead.

### what do i type into that "run length encoded seed pattern" box?

I suggest copy and pasting a pattern file from [here](https://www.google.com/search?q=rle+site:conwaylife.com/patterns&filter=0). If you insist on typing in your own patterns and you'll be disappointed if what you type turns out to be invalid, read [this description](http://conwaylife.com/wiki/Run_Length_Encoded) of run length encoded serialization.

<script type="text/javascript" src="build/bundle.js"></script>
