//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs);
    // //微信授权头像等
    // wx.getUserInfo({
    //   success: res => {
    //     // 可以将 res 发送给后台解码出 unionId
    //     this.globalData.userInfo = res.userInfo

    //     // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //     // 所以此处加入 callback 以防止这种情况
    //     if (this.userInfoReadyCallback) {
    //       this.userInfoReadyCallback(res)
    //     }
    //   }
    // })
    
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
              
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
            
    //       })
    //     }
    //   }
    // })
  },
  onShow: function() {
    this.getUserInfo();
  },
  getUserInfo: function (cb) {

    var that = this;
    wx.login({
      //获取code
      success: function (res) {
        var code = res.code //返回code
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + that.globalData.appid + '&secret=' + that.globalData.secret + '&js_code=' + code + '&grant_type=authorization_code',
          data: {},
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            var openid = res.data.openid //返回openid
            if (!openid) {
              wx.showModal({
                title: '提示',
                content: '获取openid失败，请升级微信客户端',
                showCancel: false
              })
              return;
            } else {
              wx.setStorage({
                key: 'openid',
                data: openid,
                fail: function () {
                  console.log("保存openid失败")
                }
              })
            }


          },
          fail: function () {
            console.log("获取用户的openid失败")
          }
        })
      }
    })
  },
  globalData: {
    userInfo: null,
    openid:null,
    appid: 'wx43391e3140e0d290',//不变的
    secret: 'aa34ed5253772b13e47e25d82363c019',//可能会变，从微信公众号平台获取
    userInfo: null,
    curCity: '',
    is_login: false,
    basepath: "https://lq555.cn/lili/",//服务器地址
    //basepath: "http://127.0.0.1:8080/lili/",
    mapKey: 'L44BZ-HBMKF-UK3J3-NDARG-GNNTO-3DFKK', //腾讯地图api用到的秘钥key
    sessionId: null //当前会话的sessionId，主要用于验证码
  },
  //封装一个网络请求
  networkRequest: function (options, callback) {
    var that = this;
    
    //已经登录
    
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 10000
    })
    wx.request({
      url: that.globalData.basepath + options.url,
      data: options.data,
      dataType: options.type,
      method: options.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: options.header, // 设置请求的 header
      success: function (res) {
        callback(res);
      },
      fail: function () {
        // fail
        wx.showModal({
          title: '提示',
          content: '请求网络失败，请检查网络设置',
          cancelText: '重新加载',
          cancelColor: '#f0413e',
          success: function (res) {
            if (res.confirm) {
              // wx.navigateBack({
              //   delta: 1 // 回退前 delta(默认为1) 页面
              // })
            } else {
              that.networkRequest(options, callback)
            }
          }
        })
      },
      complete: function () {
        wx.hideToast()
      }
    });
  },

  //封装一个网络请求，无加载框
  networkRequestHide: function (options, callback) {
    var that = this;
   
    wx.request({
      url: that.globalData.basepath + options.url,
      data: options.data,
      dataType: options.type,
      method: options.method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: options.header, // 设置请求的 header
      success: function (res) {
        callback(res);
      },
      fail: function () {
      },
      complete: function () {
      }
    });
  }

})