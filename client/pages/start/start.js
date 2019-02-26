//index.js
//获取应用实例
const app = getApp()

Page({
  onLoad: function () {
    setTimeout(() => {
      wx.redirectTo({url: "/pages/index/index"})
    }, 2200)
  }
})
