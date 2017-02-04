# samegame1k

## Overview

[samegame1k](http://gaborbata.github.io/samegame1k/) is a puzzle game entry
for the [JS1k 2017](http://js1k.com/2017-magic/) JavaScript code golfing competition.

The goal of the competition is to create a fancy JavaScript demo up to 1024 bytes.

## Game Description

Clear the field by removing groups of more than one colored square;
the larger the group you remove, the more points you get.

After a group is removed, the squares above it drop down to fill the empty space.
When a column is empty, all columns right of it are shifted to the left.
When there are no more groups of two or more squares left, the game is over.

The points of a marked group of squares are calculated by the formula `(n - 2) ^ 2`,
where `n` is the number of squares.
So try to remove as many squares at a time as possible to get a higher score.

Controls:

* If you click a color group, it becomes marked.
* If you click the marked group of more than one colored square, it will be removed.
* To start a new game, click on `[New]`.

## Byte-saving Techniques

This is a collection of some JavaScript tweaks used to shave bytes in the game:

Description                                     | Before                            | After
----------------------------------------------- | --------------------------------- | -----------------------------
Element IDs are registered on the window object | `document.getElementById('a')`    | `window['a']`
Define event handler as object property         | `a.addEventListener('click',b);`  | `a.onclick=b;`
Elminate `Math.floor` with `~~`                 | `Math.floor(a+b);`                | `~~(a+b);`
Multiply by boolean instead of conditionals     | `a?10:5;`                         | `a*5+5;`
Embed functionality within arguments            | `a=1;b();`                        | `b(a=1);`
Use `for` over `while`                          | `i=true;while(i)`                 | `for(i=true;i;)`
Replace `if` with ternary operator if possible  | `if(a)x();else y();`              | `a?x():y();`
Use ternary operator instead of `Math.max`      | `Math.max(a,0);`                  | `a<0?0:b;`
Use constants instead of `Array.length`         | `a=[1,2];for(i=0;i<a.length;i++)` | `a=[1,2];for(i=0;i<2;i++)`
Use reverse loops where possible                | `for(a=0;a<100;a++)`              | `for(a=100;a--;)`
Use string instead of array for color codes     | `['#aaa','#bbb'][i];`             | `'#'+'aaabbb'.substr(i*3,3);`
Use function params instead of variables        | `()=>{for(let a=100;a--;)}`       | `(a)=>{for(a=100;a--;)}`
Use default parameter values (ES6)              | `a=(x,y)=>{...};a(100,100);`      | `a=(x,y=x)=>{...};a(100);`
Use string interpolation (ES6)                  | `a='...'+b+'...';`                | ``a=`...${b}...`;``
Use expession body instead of statement (ES6)   | `()=>{a=1;return b}`              | `()=>(a=1)&&b;`

### Tools

For further optimizations the code has been minified with [Closure Compiler](https://github.com/google/closure-compiler)
and (after some manual tweaks) packed with [RegPack](https://github.com/Siorki/RegPack).

*#* | Description                                                                     | Size (bytes)
--- | ------------------------------------------------------------------------------- | ------------------------
1   | Original commented JavaScript source file                                       | 5073 (1901 w/o comments)
2   | Optimized with Closure Compiler v20170124 (ADVANCED_OPTIMIZATIONS)              | 1357
3   | Hand-tweaked and transpiled from ES5 to ES6                                     | 1237
4   | Packed with RegPack v4.0.1 (score settings: 2 * gain + 1 * length + 0 * copies) | 1024
