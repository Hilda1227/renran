import { login } from './utils/http';
//app.js
App({
  onLaunch: function () {
    if(!wx.getStorageSync('token')){
      login()
    }
    
  },
  globalData: {
    shouldReload: true
  }
})