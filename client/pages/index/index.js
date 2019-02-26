import { objectToQuery } from "../../utils/util.js"

Page({
  data: {
      records: [
          {
              img_url: 'https://cdn.dribbble.com/users/1786655/screenshots/6042308/attachments/1297830/thumbnail/__.png',
              intro: '第一次见到你已经过去',
              date: '2019年2月9日',
              days: '12',
              id: '1'
          },
          {
            img_url: 'https://cdn.dribbble.com/users/1786655/screenshots/6042308/attachments/1297830/thumbnail/__.png',
            intro: '初次见面',
            date: '2019年2月9日',
            days: '129',
            id: '2'
        }
      ]
  },
  onTap: function(e){
    let url = `/pages/detail/detail?id=${e.currentTarget.dataset.record.id}`;
    wx.navigateTo({ url })
  }
})
