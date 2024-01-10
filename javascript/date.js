const mns = 1/1000;
const snm = 1/60;
const mnh = 1/60; 
const hnd = 1/24;
const dny = 1/365;
const mny = 1/12;

const msns = 1000;
const msnMinute = 60000;
const msnHour = 3600000;
const msnDay = 86400000;
const msnYear = msnDay * 365;

export const date = {
    standard: undefined,
    default: undefined,
    universal: undefined,
    east: undefined,
    west: undefined,
    central: undefined,
    leap: false,
    dayMap: {
        0: 'Sunday',
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thurday',
        5: 'Friday',
        6: 'Saturday',
        7: null,
    },
    monthMap: {
        'January': 31,
        get 'February'(){
            if (this.leap) return 29
            return 28;
        },
        'March': 31,
        'April': 30,
        'May': 31,
        'June': 30,
        'July': 31,
        'August': 31,
        'September': 30,
        'October': 31,
        'November': 30,
        'December': 31,
    },
    days: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday',null],
    daysABRV: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat', null],
    months: ['January','February','March','April','May','June','July','August','September','October','November','December', null],
    monthsABRV: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Nov', 'Dec', null],
    isLeap: (year) => {
        return ((year % 4 == 0) && (year % 100 !=0)) || (year % 400 == 0)     
    },
    getLeaps: (to,from) => {
        function countFrom(lowest,highest) {
            let leapSince = 0;
            for (let i = lowest; i <= highest; i++) {
                if (date.isLeap(i))
                    leapSince++;
            }
            return leapSince;
        }
        return to < from ? countFrom(to,from) : countFrom(from,to);
    }
}

export function stamp() {
    return Date.now();
}

export function thisMonth() {
    let month = new Date(Date.now()).getMonth
    return date.months[month];
}

export function thisYear() {
    return new Date(Date.now()).getFullYear();
}

export function daysInMonth(month,year) {
    let days = date.monthMap[month];
    if (date.isLeap(year && (month == "February" || month == "Feb")))
        days = 29;
    return days;
}

export function msnMonth(month,year) {
    let days = daysInMonth(month, year)
    let msInMonth = days * msnDay;
    return msInMonth;
}

export function hoursAgo(stamp) {
    const then = toHours(stamp);
    const now = toHours(Date.now());
    const diffy = now - then; 
    return diffy;
}

export function secondsAgo(stamp) {
    const then = toSecondsFloat(stamp);
    const now = toSecondsFloat(Date.now());
    const diffy = now - then;
    const ago = {
        seconds: Math.floor(diffy),
        milliseconds: null,
    }
    return ago;
}

export function secondsLeft(milliseconds) {
    const minutes = toMinutesFloat(milliseconds);
    return minutes;
}

export function toSeconds(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    return seconds;
}

export function toSecondsFloat(milliseconds) {
    const seconds = milliseconds / 1000;
    return seconds;
}

export function toMinutes(milliseconds) {
    let seconds = toSeconds(milliseconds);
    let minutes = Math.floor(seconds / 60);
    return minutes;
}

export function toMinutesFloat(milliseconds) {
    const minutes = toSecondsFloat(milliseconds) / 60;
    const floored = Math.floor(minutes);
    const seconds = Math.floor((minutes - floored) / snm);

    const ago = {
        floored: floored,
        minutes: minutes,
        seconds: seconds,
        string: `${minutes} : minutes, and ${seconds} : seconds ago`,
    }
    return ago;
}

export function minutesAgo(stamp) {
    const now = toMinutesFloat(Date.now()).minutes;
    const then = toMinutesFloat(stamp).minutes;
    const minutes = Math.floor(now - then);
    const seconds = Math.floor(((now - then) - Math.floor(now - then)) / snm);

    const ago = {
        minutes: minutes,
        seconds: seconds,
        string: `${minutes} minutes, and ${seconds} seconds ago`,
    }
    return ago;
}

export function toHours(milliseconds) {
    let minutes = toMinutes(milliseconds);
    let hours = Math.floor(minutes / 60);
    return hours;
}

export function toHoursFloat(milliseconds) {
    let minutes = toMinutesFloat(milliseconds);
    let hours = minutes / 60;
    return hours;
}

export function toDays(milliseconds) {
    let hours = toHours(milliseconds);
    let days = Math.floor(hours / 24);
    return days;
}

export function toDaysFloat(milliseconds) {
    let hours = toHoursFloat(milliseconds);
    let days = hours / 24;
    return days;
}

export function toMonths(milliseconds) {

}

export function toMonthsFloat(milliseconds) {

}

export function toYears(milliseconds) {
    let days = toDays(milliseconds);
    let years = Math.floor(days / 365);
    return years;
}

// const minutesInYear = msnYear;

export function from(since) {
    const now = Date.now();
    const then = since.getTime();
    
    const monthsInYear = 1/12;

    const msInWeek = 604800000;
    const msInDay = 86400000;
    const msInHour = 3600000;
    const msInMin = 60000;
    const msInSec = 1000;
    
    const monthOf = date.months[since.getMonth()]

    const daysIn = date.monthMap[monthOf];
    const dayOf = since.getDate();
    const days = daysIn - dayOf;

    const leapSince = date.getLeaps(since.getFullYear(), new Date(now).getFullYear())
    let msAgo = now - then;
    let context = 'ago'
    if (msAgo < 0) {
        context = 'til'
    }

    msAgo = Math.abs(msAgo);

    const years = msAgo / msnYear;
    const monthsAgo = getRemainder(years);
    const months = monthsAgo / monthsInYear;

    // const weeks = monthsAgo / weeksInYear;

    const weeksAgo = Math.floor(msAgo / msInWeek);
    const daysAgo = (Math.floor(msAgo / msInDay) + leapSince);
    const hoursAgo = Math.floor(msAgo / msInHour);
    const minutesAgo = Math.floor(msAgo / msInMin);
    const secondsAgo = Math.floor(msAgo / msInSec);

    const ago = {
        since: new Date(now),
        then: new Date(then),

        years: Math.floor(years),
        months: Math.floor(months),
        days: days,

        yearsAgo: years,
        weeksAgo: weeksAgo,
        daysAgo: daysAgo,
        hoursAgo: hoursAgo,
        minutesAgo: minutesAgo,
        secondsAgo: secondsAgo,

        leaps: leapSince,
        string: undefined,
    };
    
    if (ago.yearsAgo >= 1) {
        if (ago.months >= 1) 
            ago.string = `${ago.years} Years, ${ago.months} Months ${context}`
        else if (ago.months < 1 ) 
            ago.string = `${ago.years} Years ${context}`
    }

    else if (ago.weeksAgo < 4 && ago.weeksAgo > 2) {
        ago.string = `${ago.weeksAgo} Weeks ${context}`
    }

    else if (ago.daysAgo < 14 && ago.daysAgo > 2) {
        ago.string = `${ago.daysAgo} Days ${context}`
    }
    else if (ago.hoursAgo <= 48 && ago.hoursAgo >= 1) {
        if (ago.hoursAgo < 2 && ago.hoursAgo >=1) {
            ago.string = `${ago.hoursAgo} Hour ${context}`
        } else {
            ago.string = `${ago.hoursAgo} Hours ${context}`
        }
    }
    else if (ago.minutesAgo < 59 && ago.minutesAgo > 1) {
        ago.string = `${ago.minutesAgo} Minutes ${context}`
    }
    else if (ago.secondsAgo < 60 && ago.secondsAgo > 30) {
        ago.string = `${ago.secondsAgo} Seconds ${ago}`
    }
    else if (ago.secondsAgo < 30) {
        ago.string = `Just Now`
    }
    else {
        return ago;
    }
    ago.time = ago.string.split(' ')[0];
    ago.suffix = ago.string.split(' ')[1];
    ago['context'] = context;

    return ago;
}

export function getRemainder(float) {
    return float - Math.floor(float);
}



// 333309223436
const testDay = new Date('2012-02-08T00:00:00')
const yesterday = new Date('2022-08-30T00:00:00');
const coupleHoursAgo = new Date('2022-08-31T16:32:00');
const nextHour = new Date(Date.now() + msnHour);
const thirtyTwoMintues = new Date(Date.now() + (msnMinute * 32));

const testFrom = from(nextHour);
// console.log(testFrom)
