/// <reference types="cypress" />

function fizzbuzz(num) {
  if (num % 3 === 0 && num % 5 === 0) {
    return 'fizzbuzz';
  }

  if (num % 3 === 0) {
    return 'fizz';
  }

  if (num % 5 === 0) {
    return 'buzz';
  }
}

context('CMS-1', () => {
  it('just for test', () => {
    expect(10 + 15).to.eq(25);
    expect(true).is.true;
  });
});

describe('Unit Test FizzBuzz', () => {
  function numsExpectedToEq(arr, expected) {
    // loop through the array of nums and make
    // sure they equal what is expected
    arr.forEach((num) => {
      expect(fizzbuzz(num)).to.eq(expected);
    });
  }

  it('returns "fizz" when number is multiple of 3', () => {
    numsExpectedToEq([9, 12, 18], 'fizz');
  });

  it('returns "buzz" when number is multiple of 5', () => {
    numsExpectedToEq([10, 20, 25], 'buzz');
  });

  it('returns "fizzbuzz" when number is multiple of both 3 and 5', () => {
    numsExpectedToEq([15, 30, 60], 'fizzbuzz');
  });
});
