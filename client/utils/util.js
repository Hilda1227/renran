const formatTime = (date, str) => {
  // - 转化为 / 为了兼容ios
  date = new Date(String(date).replace(/-/g, '/'));
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  if(!str){
    return `${year}年${month}月${day}日`;
  } else {
    month = String(month).padStart(2, '0');
    day = String(day).padStart(2, '0');
    return [year, month, day].join('-');
  }
}

const getTime = (str) => {
  let matchs = str.match(/(\d+)\D+(\d+)\D+(\d+)/);
  matchs.shift();
  return matchs.join('-')
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

const fetch = (url, data, method = 'GET') => {
  const BASE_URL = 'http://192.168.123.192:5000';
  const header = {Authorization: wx.getStorageSync('token')};
  console.log(wx.getStorageSync('token'))
  return new Promise(function(resolve, reject) {
    wx.request({
      url: BASE_URL + url,
      data,
      header,
      method,
      header,
      success: res => resolve(res),
      fail: error => reject(error)
    })
  })
}

const urlTobase64 = url => {
  return new Promise(function (resolve, reject){
    wx.request({
      url:url,
      responseType: 'arraybuffer', 
      success: res=>{
            let base64 = wx.arrayBufferToBase64(res.data); 
            base64　= 'data:image/jpeg;base64,' + base64;
            resolve(base64);
            console.log(base64)　
      },
      fail: error => {
        wx.showToast({ title: "图片读取失败", icon: 'none' });
        reject(error)
      }
    })
  })
} 

module.exports = {
  formatTime,
  objectToQuery,
  throttle,
  getTime
}
