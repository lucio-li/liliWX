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
    hideFlag:false,
    commentHidden: true,
    focus:false,
    momentTime: '',
    contentDetail: ''    

  },
  //事件处理函数,跳转上传照片
  bindViewTap: function() {
    wx.navigateTo({
      url: '../upload/upload'
    })
  },
  onLoad: function () {
    
    
    var that = this;
    this.getMomentsList();
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
  /**
   * 点击图片实现预览
   */
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
   * 删除动态
   */
  deleteMoment: function (e) {
    var index = e.currentTarget.dataset.index;
    var moments = this.data.moments;
    console.log(moments[index].time);
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除吗？',
      success: function (sm) {
        if (sm.confirm) {
          // 用户点击了确定 可以调用删除方法了
          wx.request({
            url: 'https://lq555.cn/lili/moments/deleteOne', //仅为示例，并非真实的接口地址   
            //url: 'http://localhost:8080/lili/moments/deleteOne',
            data: {
              time: moments[index].time
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {
              //删除成功重新加载数据
              that.getMomentsList();
            }
          })  

        } else if (sm.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  /**
   * 评论动态
   */
  clickComment: function(e) {
    var index = e.currentTarget.dataset.index;
    var moments = this.data.moments;
    this.setData({
      commentHidden:false,
      focus:true,
      momentTime: moments[index].time
    })
    console.log(this.data.userInfo)
  },
  editComment: function () {
    
  },
  /**
   * 评论输入框失去焦点隐藏
   */
  bindBlurComment: function () {
    this.setData({
      commentHidden: true,
      focus: false
    })
  },
  /**
   * 发送评论的消息
   */
  sendComment: function () {
    var that = this;
    wx.request({
      url: 'https://lq555.cn/lili/comments/add', //仅为示例，并非真实的接口地址   
      //url: 'http://localhost:8089/lili/comments/add',
      data: {
        momentsTime: this.data.momentTime,
        name: this.data.userInfo.nickName,
        contentDetail: this.data.contentDetail
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        //评论成功重新加载数据
        that.getMomentsList();
      }
    })  


  },
  /**
   * 评论输入框的改变事件
   */
  bindTextAreaBlur: function (e) {
    this.setData({
      contentDetail: e.detail.value
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

