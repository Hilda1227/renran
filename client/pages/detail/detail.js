import { reqWithToken } from "../../utils/http.js"
import { formatTime } from "../../utils/util";
import { BASE_URL } from '../../config.js';
const app = getApp()

Page({
    data: {
      records: [],
      currentItemId: null,
    },
    onLoad(){
      reqWithToken('/get_records', {}, 'GET', false).then(res =>{
        let records = res.data.records.map(item => {
          item.date = formatTime(item.date);
          if(item.days < 0) {
            item.name = "距离" + item.name + "还有";
          } else {
            item.name = item.name + "已过去";
          }
          item.days = Math.abs(item.days);
          return item;
        })

        this.setData({
          records,
          currentItemId: this.options.id,
        });
        wx.hideLoading(); 
      })  
    },

    onChange(e) {
      if(e.detail.source === 'touch') {
        this.setData({ currentItemId: e.detail.currentItemId })
      }
    },

    onShareAppMessage() {
      return {
        title: '荏苒',
        path: 'pages/index/index'
      }
    },
    
    share(){
      const getImageInfo = function(img_src){
        return new Promise(function(resolve, reject){
          wx.getImageInfo({
            src: img_src,
            success: res => {resolve(res)},
            fail: error => {reject(error)}
          })
        })
      }
      let currentRecord = this.data.records.filter(item => {
        return String(item.id) === this.data.currentItemId
      })[0];
      wx.showLoading({title: '生成中，请稍后'})
      Promise.all([
        getImageInfo(currentRecord.img_src),
        getImageInfo(BASE_URL + '/wxcode')
      ])
      .then(res => {
        const ctx = wx.createCanvasContext('shareCanvas');
        const { screenWidth, screenHeight } = wx.getSystemInfoSync();
        const pic_r = screenWidth * 0.32,
              pic_top = 50, 
              marginTop = 20, 
              marginLeft = screenWidth / 2 - pic_r;

        // 绘制背景颜色
        ctx.setFillStyle('white') 
        ctx.fillRect(0, 0, screenWidth, screenHeight);

        ctx.save()
        ctx.beginPath()
        ctx.arc(screenWidth / 2,  pic_r + pic_top, pic_r, 0, 2 * Math.PI)
        ctx.clip()

      // 底图
        let size = res[0].width > res[0].height ? res[0].height : res[0].width;
        ctx.drawImage(res[0].path, res[0].width / 2 - size / 2, res[0].height / 2 - size / 2, size, size,  marginLeft, pic_top, 2 * pic_r, 2 * pic_r);
        let endY = 2 * pic_r + pic_top;
        ctx.restore()
        ctx.setTextAlign('center'); 

      // 名字        
        ctx.save()
        ctx.setFillStyle('#405368'); 
        ctx.setFontSize(22); 
        ctx.fillText(currentRecord.name, screenWidth / 2, endY + marginTop + 30);
        endY += marginTop + 50;

      // 天数

        ctx.font = 'bold 50px normal'
        const numberWidth = ctx.measureText(String(currentRecord.days)).width
        ctx.font = 'normal 22px normal'
        const tianWidth = ctx.measureText('天').width

        ctx.font = 'bold 50px normal'
        ctx.setFillStyle('#405368'); 
        ctx.fillText(currentRecord.days, screenWidth / 2 - tianWidth / 2, endY + marginTop + 25);
        
        ctx.font = 'normal 22px normal'
        ctx.setFillStyle('#9B9B9B'); 
        ctx.fillText('天', screenWidth / 2 + numberWidth / 2, endY + marginTop + 18);
        ctx.restore()
        endY += marginTop + 50;

        // 日期
        ctx.setFillStyle('#C6CCD2'); 
        ctx.setFontSize(18); 
        ctx.fillText(currentRecord.date, screenWidth / 2, endY + marginTop + 9);
        endY += marginTop + 18;

        // 小程序码
        const code_r = screenWidth / 7;
        ctx.drawImage(res[1].path, 0, 0, res[1].width, res[1].height,  screenWidth / 2 - code_r, endY + marginTop, 2 * code_r, 2 * code_r);

        ctx.draw();
        wx.hideLoading()
        wx.showToast({title: '长按图片分享给朋友或保存', icon: 'none'})

        setTimeout(() => {
          ctx.draw(false, wx.canvasToTempFilePath({
            canvasId: 'shareCanvas',
            success: res => {
              wx.previewImage({
                  current: res.tempFilePath, // 当前显示图片的http链接
                  urls: [res.tempFilePath] // 需要预览的图片http链接列表
                })
              }
            })
          );         
        }, 1500)

      }, (error) => {
        wx.showToast({title: '图片获取失败', icon: 'none'});
      })
    }
})
  