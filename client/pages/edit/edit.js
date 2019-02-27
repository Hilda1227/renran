import { formatTime } from '../../utils/util';
Page({
  data: {
    name: '',
    date: '',
    _date: '',
    img_src: '',
    isOnce: false
  },
  onLoad(){
    let { img_src, id } = this.options;
    if(!id) { // 没有id说明是新建，日期默认当天
      this.setData({ _date: formatTime(new Date()), date: formatTime(new Date(), '-') });
    }
    if(img_src) { 
      this.setData({img_src});
    }
  },
  onInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  changeDate(e) {
    this.setData({
      _date: formatTime(new Date(e.detail.value)),
      date: e.detail.value
    })
  },
  switchChange(e) {
    this.setData({isOnce: e.detail.value});
    // let isOnce = e.detail.value;
    // wx.showModal({
    //   title: '一次?',
    //   success: res => {
    //     if(res.cancel){
    //       this.setData({isOnce: !isOnce});
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
        let img = res.tempFiles[0];
        this.setData({ img_src: img.path })
      }
    })
  },
  save(){
    wx.navigateBack({delta: 1})
  }
})
