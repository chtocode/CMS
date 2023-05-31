/**
 * global c = a; // 全局变量是魔鬼
 *
 * 1. a 1
 * 2. b 2---> add(c, b) --> 3
 *
 * 1. a ---> fn 能内部作用域的变量
 * 2. fn(b) ---> 3
 *
 */

function add(a, b) {
  return a + b;
}


function curry(fn) {
  return (a) => (b) => fn(a, b);
}

const res = curry(add)(1)(2);

console.log(res);
