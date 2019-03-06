import { reqWithToken, upload } from "../../utils/http";
import { formatTime } from "../../utils/util";

const app = getApp()
Page({
  data: {
    animationData: {},
    records: [],
    page: 1,
    total: 0,
    has_more: false,
    formatTime,

    cur_id: null,
    touches: {},
    showMenu: false
  },
  onLongPress(e) {
    this.setData({
        cur_id: e.currentTarget.dataset.record.id,
        touches: e.touches[0],
        showMenu: true
    })
  },
  onDelete() {
    this.getRecords()
  },
  onShow() {
    if(app.globalData.shouldReload){
      this.getRecords();
    }
  },
  onTap(e) {
    let url = `/pages/detail/detail?id=${e.currentTarget.dataset.record.id}`;
    wx.navigateTo({ url })
  },
  onShareAppMessage() {
    return {
      title: '荏苒',
      path: 'pages/index/index'
    }
  },
  onScroll(e) {
    let y = e.detail.deltaY;
    if(y > 20 || y < -20){
      let animation = wx.createAnimation({
        duration: 500,
        timingFunction: 'ease',
      })
      let d = y > 0 ? 0 : 150;
      animation = animation.translateY(d).step();
      this.setData({
        animationData: animation.export()
      })
    }
  },
  getRecords() {  
    this.setData({ show_loading: true })
    reqWithToken('/get_records', {page: this.data.page}, 'GET', false)
    .then(res => {
      app.globalData.shouldReload = false;
      let records = res.data.records.map(item => {
        item.date = formatTime(item.date);
        return item;
      })
      this.setData({
        records: records,
        total: res.data.total
      })
      if(this.data.page * 10 >= res.data.total){
        this.setData({ has_more: false });
      }else {
        this.setData({ has_more: true });
      }
    })
  },

  loadMore() {
    if(this.data.has_more){
      this.setData({ page: this.data.page + 1 })
      this.getRecords()
    }
  },
  record() {
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let img = res.tempFilePaths[0];
        wx.navigateTo({ url: `/pages/edit/edit?img_src=${img}` })
      }
    })
  },
  onContainTap(){
    this.setData({ showMenu: false })
  }
})
