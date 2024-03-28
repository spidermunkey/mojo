const root = document.documentElement;
const docStyle = root.style;

export function getRoot(element) {
  return element.documentElement.style;
}

export function getVar(variableName) {
  return getComputedStyle(root).getPropertyValue(variableName);
}

export function setVar(variableName, value) {
  return root.style.setProperty(variableName, value);
}

export function addClass(element, classToAdd) {
  element.classList.add(classToAdd);
}

export function removeClass(element, classToRemove) {
  element.classList.remove(classToRemove);
}

export function $(arg, context = document) {
  const element = context.querySelector(arg);

  if (!element || !(element instanceof Element)) return null;

  element.listen = function (callback, listener = "click", capture = false) {
    element.addEventListener(listener, callback, capture);
    return element;
  };

  return element;
}

export function $$(arg, element = document) {
  const array = Array.from(element.querySelectorAll(arg));
  return array;
}

export function log() {
  console.log.apply(this, arguments);
}

export function err() {
  console.log.apply(this, arguments);
}

export function each(argList, callback) {
  return argList.map(callback);
}

export function listenAll(elements, callback, listener = "click") {
  each(elements, (element) => listen(element, callback, listener));

  return elements;
}

export function listen( //element passed always last argument instead of being used as this context
  element = document,
  callback,
  listener = "click",
  capture = false,
) {
  if (!element) {
    console.warn('no element passed to listen export function')
    return;
  }

  // let context = this;

  element.addEventListener(
    listener,
    function (event) {
      // callback.element = element;
      // callback.event = event;
      callback.apply(callback,[event, ...arguments, element]);
    },
    capture
  );
}

export function responseOk(response) {
  // axios
  return response.status === 200 && response.statusText === "OK";
}

export function throttle(fn, wait = 60) {
  var time = Date.now();
  return function() {
    if ((time + wait - Date.now()) < 0) {
      fn.call(this,...arguments);
      time = Date.now();
    } else return;
  }
}


export function nextTick(callback) {
  return setTimeout(callback, 0);
}

export function toDecimal(num) {
  return num / 100;
}

export function focusInput(input, value) {
  if (!!value) input.value = value;
  input.select();
  return input;
}

export function followMouseFromEventTarget(event) {
  const { currentTarget: target } = event;

  const rect = target.getBoundingClientRect(),
    mouseXFromTarget = e.clientX - rect.left,
    mouseYFromTarget = e.clientY - rect.top;

  return {
    x: mouseXFromTarget,
    y: mouseYFromTarget,
    mouseX: e.clientX,
    mouseY: e.clientY,
  };
}

export function followMouseFromCoords(coords) {
  return function (event) {
    const { clientX, clientY } = event;
    const { x, y } = coords;

    return {
      x: clientX - x,
      y: clientY - y,
      mouseX: clientX,
      mouseY: clientY,
    };
  };
}

export function createToggleList(elements, classList = ["active"]) {
  // console.log('creating a toggle list with elements',elements,'toggling between the class(s)',classList)

  function toggle(element) {
    elements.forEach((element) => element.classList.remove(...classList));
    element.classList.add(...classList);
  }

  elements.forEach((element) => {
    // console.log(element)
    element.addEventListener("click", toggle);
  });
  return {
    classList,
    elements: [...elements],
    toggle,
    add: function (element) {
      this.elements.push(element);
    },
  };
}

export function frag() {
  return document.createDocumentFragment();
}

export function div(classList = [], styleProps = {}, attrs = {}, children) {
  const div = document.createElement("div");
  if (classList.length > 0) div.classList.add(...classList);

  if (styleProps) {
    for (prop in styleProps) {
      console.log(prop);
      console.log(styleProps[prop]);
      div.style[prop] = styleProps[prop];
    }
  }

  if (children) {
    children.forEach(div.appendChild);
  }

  return div;
}

export function ul() {
  return document.createElement("ul");
}

export function li() {
  return document.createElement("li");
}

export function span() {
  return document.createElement("span");
}

export function input() {
  return document.createElement("input");
}

export function appendElement(parent, child) {
  parent.append(child);
}

export function setBlank(destination) {
  const element = document.createElement("div");
  destination.appendChild(element);
  return element;
}

export function wipeElement(element) {
  element.innerHTML = "";
  return element;
}

export function capitalize(word) {
  return word[0].toUpperCase() + word.slice(1);
}

export function uppercase(str) {
  return [...str].map((x) => (x = x.toUpperCase())).join("");
}

export function lowercase(str) {
  return [...str].map((x) => (x = x.toLowerCase())).join("");
}

export function exclaim(str) {
  return str + "!";
}

export function first(value) {
  return value[0];
}

export function last(value) {
  return value[value.length - 1];
}

export function clearField(input) {
  input.value = "";
  return input;
}

export function clearForm(form) {
  $$("input", form).map(clearField);
  return form;
}

export function focusInputOnClick(event, placholder) {
  let input = event.target;
  if (input.nodeName !== "INPUT") return;
  if (placholder && typeof placholder == "string") input.value = placholder;

  // console.log(placholder)
  input.select();
  return input;
}

export function allChecked(inputGroup) {
  return inputGroup.every((inp) => inp.checked == true);
}

export function noneChecked(inputGroup) {
  return inputGroup.every((inp) => inp.checked == false);
}

export function oneChecked(inputGroup) {
  return inputGroup.some((inp) => inp.checked == true);
}

export function oneUnchecked(inputGroup) {
  return inputGroup.some((inp) => inp.checked == false);
}

export function disable(submitInput) {
  submitInput.disabled = true;
}

export function enable(submitInput) {
  submitInput.disabled = '';
}

export function throttleInput(input, time) {
  /* 
        https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled
        The disabled attribute is supported by 
        <button>, <fieldset>, <optgroup>, <option>, <select>, <textarea> and <input>.
    */

  input.disabled = true;
  setTimeout(() => (input.disabled = false), time);

  return;
}

export function check(input) {
  input.checked = true;
}

export function uncheck(input) {
  input.checked = false;
}

export function checkAll(inputGroup) {
  inputGroup.forEach((inp) => (inp.checked = true));
}

export function uncheckAll(inputGroup) {
  inputGroup.forEach((inp) => (inp.checked = false));
}

export function currentTime() {
  return new Date().toLocaleTimeString();
}

export function mouseClickRight(event) {
  return event.button === 2;
}

export function mouseClickLeft(event) {
  return event.button === 0;
}

export function isNumberKey(event) {
  var charCode = event.which ? event.which : event.keyCode;
  if (charCode > 31 && (charCode < 48 || charCode > 57)) return false;
  return true;
}

export function highlightInput(input) {
  input.focus();
  input.select();
  return input;
}

export function isBackspaceKey(event) {
  return event.keyCode == 8;
}

export function isEmptyNumberInput(input) {
  return input.value === 0 || input.value === "0" || input.value === "";
}

export function elementClicked(elementClass, event) {
  return event.target.closest(elementClass);
}

export function toClipboard(value, message) {
  window.navigator.clipboard.writeText(value);
  if (message) console.log("message from clipboard", message);
}

export function mergeObj(targetObj, mergingObj) {
  return {
    ...structuredClone(targetObj),
    ...structuredClone(mergingObj),
  };
}

export function uuid() {
  let timmy = Date.now().toString(36).toLocaleLowerCase();
  // random high number
  let randy = parseInt(Math.random() * Number.MAX_SAFE_INTEGER);
  // random high num to hex => "005EIPQUTQ64" => add 0s to make sure its 12digits
  randy = randy.toString(36).slice(0, 12).padStart(12, "0").toLocaleUpperCase();
  // coerce into a string
  return "".concat(timmy, "-", randy);
}
