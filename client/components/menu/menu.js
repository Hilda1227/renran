import { reqWithToken } from '../../utils/http'

Component({
    options: {
      multipleSlots: true // 在组件定义时的选项中启用多slot支持
    },
    data: {
        style: '',
    },
    properties: {
        cur_id: String,
        touches: Object,
        showMenu: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal, changedPath) {
                this.toggleMenu()
            }
        }
    },
    methods: { 
        delete() {
            reqWithToken('/delete', {id: this.properties.cur_id}, 'DELETE')
            .then((res) => {
                wx.hideLoading();
                this.triggerEvent('delete')
            })
        },
        edit() {
            let url = `/pages/edit/edit?id=${this.data.cur_id}`;
            wx.navigateTo({ url });
        },  
        toggleMenu () {
            if(this.properties.showMenu){
                const {pageX, pageY} = this.properties.touches;
                const { screenWidth, screenHeight } = wx.getSystemInfoSync();
                let dx = 'left', dy = 'top', x = pageX, y = pageY;
                if(screenWidth / 2 < x ) {
                    dx = 'right'; x = screenWidth - x + 150; // 150是面板宽度
                };  
                if(screenHeight / 2 < y ){
                    dy = 'bottom'; y = screenHeight - y;
                };      
                let style = `${dx}: ${x}px; ${dy}: ${y}px`;
                this.setData({style});
            }
        }   
    }
  })