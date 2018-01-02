//index.js
//获取应用实例

const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    list: [1,2,3],
    moments: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    avatarUrlList: [],
    hideFlag:false
  },
  //事件处理函数,跳转上传照片
  bindViewTap: function() {
    wx.navigateTo({
      url: '../upload/upload'
    })
  },
  onLoad: function () {
    
    
    var that = this;
    
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        
        if (res.code) {
          // wx.request({
          //   url: 'https://lq555.cn/lili/user/getOpenid',
          //   //url: 'http://127.0.0.1:8080/lili/user/getOpenid',
          //   data: {
          //     js_code: res.code,
          //     appid: 'wx43391e3140e0d290',
          //     secret: 'de0d88d0f32a008aa51d33d0dfe0b0a1',
          //     grant_type: 'authorization_code'
          //   },
          //   success: function (res) {
          //     app.globalData.openid = res.data.openid;
          //     that.getMomentsList();
          //     wx.request({
          //       url: 'https://lq555.cn/lili/user/add',
          //       data: {
          //         openid: res.data.openid
          //       },
          //       success: function (res) {

          //       }
          //     })
          //   }
          // })
        }
      }
    })




    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    

  

  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //获取所有朋友圈动态的内容
  getMomentsList :function () {
    var that =  this;
    wx.request({
      url: 'https://lq555.cn/lili/moments/list', //仅为示例，并非真实的接口地址   
      //url: 'http://localhost:8080/lili/moments/list',
      data: {
        // openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        that.setData({
          moments: res.data.momentsList,
          avatarUrlList: res.data.avatarUrlList,
          hideFlag:true
        })
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    })
  },
  clickImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      current: index,
      urls: [index],
      fail: function () {

      },
      complete: function () {

      },
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getMomentsList();
  },
  /**
   * 页面相关事件处理函数--监听下拉刷新
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.getMomentsList();
  },
})

