import { throttle } from "../../utils/util.js"
let p = {
  touchS: [],
  touchE: []
}
Page({
    data: {
      records: [
        {
            img_src: 'https://cdn.dribbble.com/users/1786655/screenshots/6042308/attachments/1297830/thumbnail/__.png',
            name: '第一次见到你已经过去',
            date: '2019年2月9日',
            days: '12',
            id: '1'
        },
        {
          img_src: 'https://cdn.dribbble.com/users/1786655/screenshots/6042308/attachments/1297830/thumbnail/__.png',
          name: '初次见面',
          date: '2019年2月9日',
          days: '129',
          id: '2'
        },
        {
          img_src: 'https://cdn.dribbble.com/users/1786655/screenshots/6042308/attachments/1297830/thumbnail/__.png',
          name: '初次见面',
          date: '2019年2月9日',
          days: '129',
          id: '3'
        }
    ],
      currentItemId: '',
      showCanvas: false
    },
    onLoad(){
      this.setData({currentItemId: this.options.id});      
    },
    onChange(e) {
      this.setData({ currentItemId: e.detail.currentItemId })
    },
    onShareAppMessage() {
      return {
        title: '转发',
        path: '/detail/detail'
      }
    },
    share(){
      // this.onShareAppMessage();
      this.setData({showCanvas: true});
      const wxGetImageInfo = function(img_src){
        return new Promise(function(resolve, reject){
          wx.getImageInfo({
            src: img_src,
            success: res => {resolve(res)},
            fail: error => {reject(error)}
          })
        })
      }

      Promise.all([
        wxGetImageInfo('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550766202199&di=144a6f46f9e3971498529d588c8579fd&imgtype=0&src=http%3A%2F%2Fattimg.dospy.com%2Fimg%2Fday_130413%2F20130413_7efd5ac27a6ebd81743e72wqQl1A71TP.jpg'),
        wxGetImageInfo('https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1550766202199&di=144a6f46f9e3971498529d588c8579fd&imgtype=0&src=http%3A%2F%2Fattimg.dospy.com%2Fimg%2Fday_130413%2F20130413_7efd5ac27a6ebd81743e72wqQl1A71TP.jpg')
      ])
      .then(res => {
        let currentRecord = this.data.records.filter((item) => item.id == this.data.currentItemId)[0];
        const ctx = wx.createCanvasContext('shareCanvas');
        const { screenWidth, screenHeight } = wx.getSystemInfoSync();
        const r = screenWidth * 0.3, 
              marginTop = screenWidth * 0.14, 
              marginLeft = screenWidth / 2 - r;

        ctx.setFillStyle('white')
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        ctx.save()
        ctx.beginPath()
        ctx.arc(screenWidth / 2,  marginTop + r, r, 0, 2 * Math.PI)
        ctx.clip()
      // 底图
        ctx.drawImage(res[0].path, 0, 0, res[0].width, res[0].height,  marginLeft, marginTop, 2 * r, 2 * r);
        let endY = marginTop + 2 * r;
        ctx.restore()

        ctx.setTextAlign('center'); // 文字居中

      // 名字
        ctx.setFillStyle('#405368'); // 文字颜色：黑色
        ctx.setFontSize(20); // 文字字号：22px
        ctx.fillText(currentRecord.name, screenWidth / 2, endY + marginTop);
        endY += marginTop + 30;
      // 天数
        ctx.setFillStyle('#405368'); // 文字颜色：黑色
        ctx.setFontSize(64); // 文字字号：22px
        ctx.fillText(currentRecord.days, screenWidth / 2, endY + marginTop);
        ctx.setFillStyle('#9B9B9B'); // 文字颜色：黑色
        ctx.setFontSize(20); // 文字字号：22px
        ctx.fillText('天', screenWidth / 2 + 50, endY + marginTop);
        endY += marginTop - 10;

        // 日期
        ctx.setFillStyle('#405368'); // 文字颜色：黑色
        ctx.setFontSize(18); // 文字字号：22px
        ctx.fillText(currentRecord.date, screenWidth / 2, endY + marginTop);
        endY += marginTop + 18;

        // 小程序码
        const code_r = screenWidth / 9;
        ctx.beginPath()
        ctx.arc(screenWidth / 2,  endY + marginTop, code_r, 0, 2 * Math.PI)
        ctx.clip()
        ctx.drawImage(res[1].path, 0, 0, res[1].width, res[1].height,  screenWidth / 2 - code_r, endY + marginTop - code_r, 2 * code_r, 2 * code_r);

        ctx.stroke();
        ctx.draw();
      })
      .then(() => {
        wx.canvasToTempFilePath({
          canvasId: 'shareCanvas',
          success(res) {
            wx.previewImage({
              current: res.tempFilePath, // 当前显示图片的http链接
              urls: [res.tempFilePath] // 需要预览的图片http链接列表
            })
            console.log(res.tempFilePath)
          }
        })
      })
    }


  })
  