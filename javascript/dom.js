import * as R from 'ramda'

export {R};

export var $ = (arg,element = document) => element.querySelector(arg)
export var $$ = (arg,element = document) => Array.from(element.querySelectorAll(arg));
export var log = (...args) => console.log.apply(this,args);
export var err = (...args) => console.log.call(this,args);
export var curry = R.curry;

export const frag = () => document.createDocumentFragment();
export const div = () => document.createElement('div');
export const ul = () => document.createElement('ul');

export const append = curry((parent,child) => parent.append(child));
export const appendChild = curry((parent,child) => parent.appendChild(child))

export const clearField = inp => inp.value = "";
export const clearForm = form => $$("input",form).forEach(clearField)

export const capitalize = word => R.head(word).toUpperCase() + word.slice(1);
export const toUpper = str =>str.toUpperCase();
export const exclaim = str => str + '!';
export const first = xs => xs[0];

export const split = curry((delimeter,string) => string.split(delimeter)); 
export const splitWords = split(' ');
export const replaceString = curry((regex, replacement, str) => str.replace(regex, replacement));
export const replaceVowels = w => replaceString(/[AEIOU]/ig,w)
export const concat = curry((y,x) => x + y);


export function createBus(...fns) {
    return {
        tl: [...fns],
        add: function (fn) {
            this.tl.push(fn);
        },
        run: function (data) {
            fns.forEach(fn => fn(data))
        }
    }
}

export function getCoords(element) {
    return element.getBoundingClientRect();
}

export function mouseFromTarget(event) {

    const { currentTarget: target } = event;

    const rect = target.getBoundingClientRect(), 
        mouseXFromTarget = e.clientX - rect.left,
        mouseYFromTarget = e.clientY - rect.top;

    return {
        x: mouseXFromTarget,
        y: mouseYFromTarget,
        mouseX: e.clientX,
        mouseY: e.clientY,
    }
}

export const mouseFromCoords = curry( (coords,event) => {

    const { clientX , clientY } = event; 
    const { x, y } = coords;

    return {
        x: clientX - x,
        y: clientY - y,
    }

})

export function mouseX(evt) {

    if (evt.pageX)
      return evt.pageX;

    if (evt.clientX) 
      return evt.clientX + (document.documentElement.scrollLeft 
                ? document.documentElement.scrollLeft 
                : document.body.scrollLeft);
    
    else
      return false;
    
}
  
export function mouseY(evt) {

    if (evt.pageY)
      return evt.pageY;

    if (evt.clientY)
      return evt.clientY + (document.documentElement.scrollTop 
                ? document.documentElement.scrollTop 
                : document.body.scrollTop);
    else
      return false;

}

export async function httpPost(url = "", data = {}) {

    const response = await fetch( url ,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        })

    if (response.ok) {
        const result = await response.json();
        return result
    }
    console.log('resonse not ok' ,response)
}

// always returns response.json()
export async function httpGet(url = "") {

    const response = await fetch(url);
    
    if (response.ok) {
        const result = await response.json();
        return result
    }
}

export function sanitize(string) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        "/": '&#x2F;',
        "`": '&grave;',
        '`': '&#x60;',
        '=': '&#x3D;',
    };
    const reg = /[&<>"'/]/ig;
    return string.replace(reg, (match)=>(map[match]));
}

// export const match = regex => str => str.match(regex)
// export const strCheck = (success,err) => str => match(str) ? success(str) : err(str)

export function checkSTR(string) {
if(string.match(/^[0-9a-zA-Z]{1,16}$/)){
    //The id is fine
}
else{
    //The id is illegal
}
}

export function escapeHtml (string) {
return String(string).replace(/[&<>"'`=\/]/g, function (s) {
  return entityMap[s];
})
}