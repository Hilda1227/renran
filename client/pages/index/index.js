import { objectToQuery } from "../../utils/util.js"

Page({
  data: {
    animationData: {},
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
          id: '2'
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
      id: '2'
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
  id: '2'
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
  id: '2'
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
  id: '2'
},
{
  img_src: 'https://cdn.dribbble.com/users/1786655/screenshots/6042308/attachments/1297830/thumbnail/__.png',
  name: '初次见面',
  date: '2019年2月9日',
  days: '129',
  id: '2'
}
      ]
  },
  onTap: function(e){
    let url = `/pages/detail/detail?id=${e.currentTarget.dataset.record.id}`;
    wx.navigateTo({ url })
  },
  onShareAppMessage() {
    return {
      title: '转发',
      path: '/detail/detail'
    }
  },
  record: function(){
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        let img = res.tempFiles[0];
        wx.navigateTo({ url: `/pages/edit/edit?img_src=${img.path}` })
      }
    })
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
  }
})
