/**
 * Created by jiachenpan on 16/11/18.
 */

 /**
 * @param {Object} d  时间
 * @param {Object} formatter "yyyy-MM-dd W hh:mm:ss" w:englist week W:chinese week
 */
Date.prototype.format = function(formatter) {
    var d = this;
    if (!formatter || formatter == "") {
        formatter = "yyyy-MM-dd";
    }
    var lang = formatter.indexOf("W") > 0 ? "chi" : "eng";
    var weekdays = {
        chi : ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
        eng : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    };
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    var date = d.getDate().toString();
    var day = d.getDay();
    var hour = d.getHours().toString();
    var minute = d.getMinutes().toString();
    var second = d.getSeconds().toString();

    var yearMarker = formatter.replace(/[^y|Y]/g, '');
    if (yearMarker.length == 2) {
        year = year.substring(2, 4);
    } else if (yearMarker.length == 0) {
        year = "";
    }

    var monthMarker = formatter.replace(/[^M]/g, '');
    if (monthMarker.length > 1) {
        if (month.length == 1) {
            month = "0" + month;
        }
    } else if (monthMarker.length == 0) {
        month = "";
    }

    var dateMarker = formatter.replace(/[^d]/g, '');
    if (dateMarker.length > 1) {
        if (date.length == 1) {
            date = "0" + date;
        }
    } else if (dateMarker.length == 0) {
        date = "";
    }

    var hourMarker = formatter.replace(/[^h]/g, '');
    if (hourMarker.length > 1) {
        if (hour.length == 1) {
            hour = "0" + hour;
        }
    } else if (hourMarker.length == 0) {
        hour = "";
    }

    var minuteMarker = formatter.replace(/[^m]/g, '');
    if (minuteMarker.length > 1) {
        if (minute.length == 1) {
            minute = "0" + minute;
        }
    } else if (minuteMarker.length == 0) {
        minute = "";
    }

    var secondMarker = formatter.replace(/[^s]/g, '');
    if (secondMarker.length > 1) {
        if (second.length == 1) {
            second = "0" + second;
        }
    } else if (secondMarker.length == 0) {
        second = "";
    }

    var dayMarker = formatter.replace(/[^w|W]/g, '');
    var result = formatter.replace(yearMarker, year).replace(monthMarker, month).replace(dateMarker, date).replace(hourMarker, hour).replace(minuteMarker, minute).replace(secondMarker, second);
    if (dayMarker.length != 0) {
        result = result.replace(dayMarker, weekdays[lang][day]);
    }

    return result;
};

 export function parseTime(time, cFormat) {
   if (arguments.length === 0) {
     return null;
   }
   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
   let date;
   if (typeof time == 'object') {
     date = time;
   } else {
     if (('' + time).length === 10) time = parseInt(time) * 1000;
     date = new Date(time);
   }
   const formatObj = {
     y: date.getFullYear(),
     m: date.getMonth() + 1,
     d: date.getDate(),
     h: date.getHours(),
     i: date.getMinutes(),
     s: date.getSeconds(),
     a: date.getDay()
   };
   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
     let value = formatObj[key];
     if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1];
     if (result.length > 0 && value < 10) {
       value = '0' + value;
     }
     return value || 0;
   });
   return time_str;
 }

 export function formatTime(time, option) {
   time = +time * 1000;
   const d = new Date(time);
   const now = Date.now();

   const diff = (now - d) / 1000;

   if (diff < 30) {
     return '刚刚'
   } else if (diff < 3600) { // less 1 hour
     return Math.ceil(diff / 60) + '分钟前'
   } else if (diff < 3600 * 24) {
     return Math.ceil(diff / 3600) + '小时前'
   } else if (diff < 3600 * 24 * 2) {
     return '1天前'
   }
   if (option) {
     return parseTime(time, option)
   } else {
     return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
   }
 }

// 格式化时间
 export function getQueryObject(url) {
   url = url == null ? window.location.href : url;
   const search = url.substring(url.lastIndexOf('?') + 1);
   const obj = {};
   const reg = /([^?&=]+)=([^?&=]*)/g;
   search.replace(reg, (rs, $1, $2) => {
     const name = decodeURIComponent($1);
     let val = decodeURIComponent($2);
     val = String(val);
     obj[name] = val;
     return rs;
   });
   return obj;
 }


/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
 export function getByteLen(val) {
   let len = 0;
   for (let i = 0; i < val.length; i++) {
     if (val[i].match(/[^\x00-\xff]/ig) != null) {
       len += 1;
     } else { len += 0.5; }
   }
   return Math.floor(len);
 }

 export function cleanArray(actual) {
   const newArray = [];
   for (let i = 0; i < actual.length; i++) {
     if (actual[i]) {
       newArray.push(actual[i]);
     }
   }
   return newArray;
 }

 export function param(json) {
   if (!json) return '';
   return cleanArray(Object.keys(json).map(key => {
     if (json[key] === undefined) return '';
     return encodeURIComponent(key) + '=' +
            encodeURIComponent(json[key]);
   })).join('&');
 }

 export function param2Obj(url) {
   const search = url.split('?')[1];
   if (!search) {
     return {}
   }
   return JSON.parse('{"' + decodeURIComponent(search).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
 }

 export function html2Text(val) {
   const div = document.createElement('div');
   div.innerHTML = val;
   return div.textContent || div.innerText;
 }

 export function objectMerge(target, source) {
    /* Merges two  objects,
     giving the last one precedence */

   if (typeof target !== 'object') {
     target = {};
   }
   if (Array.isArray(source)) {
     return source.slice();
   }
   for (const property in source) {
     if (source.hasOwnProperty(property)) {
       const sourceProperty = source[property];
       if (typeof sourceProperty === 'object') {
         target[property] = objectMerge(target[property], sourceProperty);
         continue;
       }
       target[property] = sourceProperty;
     }
   }
   return target;
 }


 export function scrollTo(element, to, duration) {
   if (duration <= 0) return;
   const difference = to - element.scrollTop;
   const perTick = difference / duration * 10;
   setTimeout(() => {
     console.log(new Date())
     element.scrollTop = element.scrollTop + perTick;
     if (element.scrollTop === to) return;
     scrollTo(element, to, duration - 10);
   }, 10);
 }

 export function toggleClass(element, className) {
   if (!element || !className) {
     return;
   }
   let classString = element.className;
   const nameIndex = classString.indexOf(className);
   if (nameIndex === -1) {
     classString += '' + className;
   } else {
     classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + className.length);
   }
   element.className = classString;
 }

 export const pickerOptions = [
   {
     text: '今天',
     onClick(picker) {
       const end = new Date();
       const start = new Date(new Date().toDateString());
       end.setTime(start.getTime());
       picker.$emit('pick', [start, end]);
     }
   }, {
     text: '最近一周',
     onClick(picker) {
       const end = new Date(new Date().toDateString());
       const start = new Date();
       start.setTime(end.getTime() - 3600 * 1000 * 24 * 7);
       picker.$emit('pick', [start, end]);
     }
   }, {
     text: '最近一个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString());
       const start = new Date();
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
       picker.$emit('pick', [start, end]);
     }
   }, {
     text: '最近三个月',
     onClick(picker) {
       const end = new Date(new Date().toDateString());
       const start = new Date();
       start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
       picker.$emit('pick', [start, end]);
     }
   }]

 export function getTime(type) {
   if (type === 'start') {
     return new Date().getTime() - 3600 * 1000 * 24 * 90
   } else {
     return new Date(new Date().toDateString())
   }
 }

 export function debounce(func, wait, immediate) {
   let timeout, args, context, timestamp, result;

   const later = function() {
    // 据上一次触发时间间隔
     const last = +new Date() - timestamp;

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
     if (last < wait && last > 0) {
       timeout = setTimeout(later, wait - last);
     } else {
       timeout = null;
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
       if (!immediate) {
         result = func.apply(context, args);
         if (!timeout) context = args = null;
       }
     }
   };

   return function(...args) {
     context = this;
     timestamp = +new Date();
     const callNow = immediate && !timeout;
    // 如果延时不存在，重新设定延时
     if (!timeout) timeout = setTimeout(later, wait);
     if (callNow) {
       result = func.apply(context, args);
       context = args = null;
     }

     return result;
   };
 }


 export function deepClone(source) {
   if (!source && typeof source !== 'object') {
     throw new Error('error arguments', 'shallowClone');
   }
   const targetObj = source.constructor === Array ? [] : {};
   for (const keys in source) {
     if (source.hasOwnProperty(keys)) {
       if (source[keys] && typeof source[keys] === 'object') {
         targetObj[keys] = source[keys].constructor === Array ? [] : {};
         targetObj[keys] = deepClone(source[keys]);
       } else {
         targetObj[keys] = source[keys];
       }
     }
   }
   return targetObj;
 }
