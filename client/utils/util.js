const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const objectToQuery = object => {
  let r = '?';
  for(let prop in object){
    r += `${prop}=${object[prop]}&`;
  };
  r = r.substring(0, r.length - 1);
  return r;
}

const throttle = (fn, delay) => {
  let last = 0, timer = null;
  return function () {
      let context = this, args = arguments;
      let now = new Date();
      if(now-last >= delay){
          last = new Date();
          fn.apply(context, args);                
      } else {
          clearTimeout(timer);
          timer = setTimeout( () => {
              last = new Date();
              fn.apply(context, args)
          }, delay)
      }
  }
}

const promiseify = fn => {
  return function(...args){
    fn(...args)
  }
}

module.exports = {
  formatTime,
  objectToQuery,
  throttle,
}
