import { BASE_URL } from '../config.js';

const request = (url, data, method = 'GET') => {
    wx.showLoading({title: "loading"});
    return new Promise(function(resolve, reject) {
        wx.request({
            url: BASE_URL + url,
            data,
            method,
            success: res => {
                if(res.data.error){
                    wx.showToast({title: res.data.error, icon: 'none'});
                    reject(res);
                } else{
                    wx.hideLoading();
                    resolve(res)
                }
            },
            fail: error => reject(error)
        })
    })

}


const login = () => {
    return new Promise(function (resolve, reject) {
        wx.login({
            success: res => {
                if(res.code){
                    request('/login', {code: res.code}, 'POST')
                    .then(res => {
                        if(res.data.token){
                            wx.setStorageSync('token', res.data.token)
                            resolve(res.data.token)
                        } else {
                            wx.showToast({ title: "授权失败：无效的token", icon: 'none' })
                            reject();
                        }
                    }, error => {
                        reject(error);
                        wx.showToast({ title: "授权失败", icon: 'none' })
                    })
                }
            },
            fail: error => {
                wx.showToast({ title: "授权失败：code获取失败", icon: 'none' })
                reject();
            }
        })
    })
}

const reqWithToken = (url, data, method = 'GET', withLoading = true) => {
    let token = wx.getStorageSync('token')
    function dosomething () {
        if(withLoading) wx.showLoading({title: "loading"});
        const header = {Authorization: wx.getStorageSync('token')};
        return new Promise(function(resolve, reject) {
            wx.request({
                url: BASE_URL + url,
                data,
                header,
                method,
                header,
                success: res => {
                    console.log(res.data)
                    if(res.data.error){
                        wx.showToast({title: res.data.error, icon: 'none'});
                        reject(res);
                    } else{
                        wx.hideLoading()
                        resolve(res)
                    }
                },
                fail: error => reject(error)
            })
        })
    }
    if(token){
        return dosomething()
    }
    else {
        return login().then(dosomething)
    }
}
  
const upload = url => {
    wx.showLoading({title: "loading"})
    return new Promise(function(resolve, reject) {
        let tmp = /:\/\/tmp/.test(url);
        if(tmp){
            wx.uploadFile({
                url: BASE_URL + '/upload',
                filePath: url,
                name: 'file',
                success: res => {
                    res.data = JSON.parse(res.data);
                    if(res.data.error){
                        wx.showToast({title: res.data.error, icon: 'none'});
                        reject(res);
                    } else{
                        wx.hideLoading()
                        resolve(res.data.img_src)
                    }
                },
                fail: error => {reject(error);  console.log(error)}
            })
        }else {
            // 如果不是临时url则不用上传 直接resolve
            resolve(url);
        }
        
    })
}



  module.exports = {
    request,
    reqWithToken,
    upload,
    login
  }