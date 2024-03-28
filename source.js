import {mojo} from './index.js'
console.log('hello mojo');
console.log('testing api')
window.mojo = mojo
for (const prop in mojo) {
    window[prop] = mojo[prop];
}
// console.log(window.clearField = mojo.clearField)
console.log(clearField)
console.log(getRoot)