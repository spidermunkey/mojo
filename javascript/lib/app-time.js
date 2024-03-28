import {DateTime} from './utils.js';

const curDate = new Date()
const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

export function getClock() {
    const currTime = {dow,month,date,hour,minute,context} = DateTime.clock;
    return currTime;
}
export function setClock(element) {

    const {dow,month,date,hour,minute,context} = DateTime.clock;
    
    $('#app-header-dow',element).textContent = dow
    $('#app-header-hour',element).textContent = hour <= 12 ? hour : hour - 12;
    $('#app-header-minute',element).textContent = minute >= 10 ? minute : minute.toString().padStart(2,'0');
    $('#app-header-time-context',element).textContent = context;
    $('#app-header-month',element).textContent = month.slice(0,3);
    $('#app-header-day',element).textContent = date;

    return element;
}

const msTilNextMinute = (60000 - (curDate.getSeconds() * 1000) + curDate.getMilliseconds())

export function run() {
    setTimeout(() => {
        setClock();
        setInterval(setClock,60000);
    },msTilNextMinute);
    
    setClock();
}

// run();

// console.log(curDate.getHours())
// console.log(curDate.getMinutes())
