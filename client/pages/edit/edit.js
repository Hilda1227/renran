import { formatTime, getTime,  } from '../../utils/util';
import { upload, reqWithToken } from '../../utils/http';
var app = getApp();
Page({
  data: {
    name: '',
    date: '',
    img_src: '',
    is_once: false,
    isDisabled: false
  },
  onLoad(){
    let { img_src, id } = this.options;
    if(!this.options.id) { // 没有id说明是新建，日期默认当天
      upload(img_src).then(url => {
      this.setData({ date: formatTime(new Date()), img_src: url });
      })
    }
    else { // 有id说明是修改
      this.id = id;
      reqWithToken('/get_record', {id})
      .then(res => {
        this.setData({
          ...res.data, date: formatTime(res.data.date)
        })
        wx.hideLoading();
      })
    }
  },
  onInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  changeDate(e) {
    this.setData({
      date: formatTime(new Date(e.detail.value)),
    })
  },
  switchChange(e) {
    this.setData({is_once: e.detail.value});
    // let is_once = e.detail.value;
    // wx.showModal({
    //   title: '一次?',
    //   success: res => {
    //     if(res.cancel){
    //       this.setData({is_once: !is_once});
    //     }
    //   },
    // })
  },
  chooseImg() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let img = res.tempFilePaths[0];
        upload(img).then(img_src => {
          this.setData({ img_src })
        })
      }
    })
  },
  save(){
    let name = this.data.name.trim()
    if(!name.length){
      return wx.showToast({title: '输入栏不能为空', icon: 'none'});
    }else {
      this.setData({ isDisabled: true })
      let {date, is_once, img_src} = this.data;
      date = getTime(date);
      if(this.id){
        reqWithToken('/modify', {name, img_src, date, is_once, id: this.id}, 'POST')
        .then(res => {
          this.setData({ isDisabled: false })
          app.globalData.shouldReload = true;
          wx.redirectTo({ url: `/pages/detail/detail?id=${res.data.id}`})
        })
      }
      else {
        reqWithToken('/create', {name, img_src, date, is_once}, 'POST')
        .then(res => {
          this.setData({ isDisabled: false })
          app.globalData.shouldReload = true;
          wx.redirectTo({ url: `/pages/detail/detail?id=${res.data.id}`})
        })
      }

    }
  }
})
