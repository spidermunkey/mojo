import * as R from 'ramda';

export const bang = num => num == 1 ? 0 : num == 0 ? 1 : num;

export const isNum = value => R.is(Number,value) && value !== NaN;
export const isArray = value => R.is(Array, value);
export const isObj = value => R.is(Object, value);

export const add = R.curry((x,y) => x + y);
export const subtract = R.curry((x,y) => y - x);

export const incer = add(1);
export const decer = subtract(1);

export const modulo = R.curry((x,y) => y % x);

export const isOdd = modulo(2);
export const isEven = num => bang(isOdd(num));
export const getOdds = filter(isOdd);
export const getEvents = filter(isEven)

export const sumTotal = (array) => array.reduce(add);

export function getRandomIndex(arr) {
    return Math.floor( Math.random() * arr.length );
}

export function uuid() {
    let timmy = Date.now().toString(36).toLocaleLowerCase();
    // random high number
    let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
    // random high num to hex => "005EIPQUTQ64" => add 0s to make sure its 12digits
    randy = randy.toString(36).slice(0, 12).padStart(12, '0').toLocaleUpperCase();
    // coerce into a string
    return ''.concat(timmy, '-', randy);
}

export function nthSuffix(num) {
    if (!isNaN(num)) {
        let n = num;
        let suff;

        if (num > 20) {
            // convert to string
            d = num.toString()
            // grab the last digit
            n = d[d.length - 1];
        }

        n == 1 ? suff = 'st'
        : n == 2 ? suff = 'nd'
        : n == 3 ? suff = 'rd'
        : suff = 'th'

        return num.toString() + suff;
    }
}

export function average(array) {
    return array.reduce((a, b) => a + b) / array.length;
}

export function midpoint() {
    return (Math.min.apply(null, arguments) + Math.max.apply(null, arguments)) / 2;
}

export function unless(test, then) {
    if (!test) then();
}

export function repeat(n, action) {
    for (let i = 0; i < n; i++) {
      action(i);
    }
}

export function greaterThan(n) {
    return m => m > n;
}

export function repeatLog(n) {
    for (let i = 0; i < n; i++) {
      console.log(i);
    }
}

export function every(cond, array) {
    let result = true;
    for (index of array) {
        if (!cond(index)) {
            result = false;
        }
    }
    return result;
}
export * from './helpers.js'