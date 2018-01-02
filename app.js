//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //微信授权头像等
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        this.globalData.userInfo = res.userInfo

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
      }
    })
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     var that = this;
    //     if (res.code) {
    //       wx.request({
    //         url: 'https://lq555.cn/lili/user/getOpenid',
    //         //url: 'http://127.0.0.1:8080/lili/user/getOpenid',
    //         data: {
    //           js_code: res.code,
    //           appid: 'wx43391e3140e0d290',
    //           secret: 'de0d88d0f32a008aa51d33d0dfe0b0a1',
    //           grant_type: 'authorization_code'
    //         },
    //         success: function(res) {
    //           that.globalData.openid = res.data.openid;
    //           console.log(that.globalData.openid)
    //           wx.request({
    //             url: 'https://lq555.cn/lili/user/add',
    //             data: {
    //               openid: res.data.openid
    //             },
    //             success:function(res) {
                  
    //             }
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
            
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null
  }
})