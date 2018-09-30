var app = getApp()
var basepath = app.globalData.basepath;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: "",
    location: "",
    hasImages:false,
    images: [],
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowTime = new Date();
    var m = nowTime.getMonth() + 1;
    var d = nowTime.getDate();
    var h = nowTime.getHours();
    var minutes = nowTime.getMinutes();
    var s = nowTime.getSeconds();
    if (m < 10) {
      m = "0" + m;
    }
    if (d < 10) {
      d ="0" + d;
    }
    if (h < 10) {
      h = "0" + h;
    }
    if (minutes < 10) {
      minutes = "0" + minutes;
    }
    if (s < 10) {
      s = "0" + s;
    }
    var t = nowTime.getFullYear() + "-" + m + "-"
      + d + " " + h + ":"
      + minutes + ":" + s;
    this.setData({
      time: t
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("页面显示")
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("qqq")
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },
  /**
   * 页面上点击选择图片事件的处理函数
   */
  bindChooseImages: function () {
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths
        var dataFilePaths = that.data.images;
        tempFilePaths.forEach(function (imageUrl) {
          
          dataFilePaths.push(imageUrl);
        })
        
        that.setData({
          images: dataFilePaths
        })
      }
    })
  },
  clickImage: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var pictures = this.data.images;
    console.log(pictures[index])
    wx.previewImage({
      current: pictures[index],
      urls: pictures,
      fail: function () {
        
      },
      complete: function () {
        
      },
    })
  },
  deleteImageTap: function (e) {
    var index = e.currentTarget.dataset.index;
    var pictures = this.data.images;
    pictures.splice(index, 1);
    this.setData({
      images: pictures
    })
  },
  bindChooseLocation: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          location: res.name
        })
      }
    })
    
  },
  bindTextAreaBlur: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindUpload: function () {
    var that = this;
    wx.navigateTo({
      url: '../index/index'
    })
    var that = this;
    var options = {
      avatarUrl: app.globalData.userInfo.avatarUrl,
      time: that.data.time,
      location: that.data.location,
      content: that.data.content
    };
    var opp = {};
    opp.url = "upload/content";
    opp.data = options;
    opp.header = { "Content-Type": "application/json" };
    app.networkRequest(opp, function (res) {
      that.data.images.forEach(function (imageUrl) {
        that.uploadAllImage(res.data.directory, imageUrl);
      });
    })
    
  },
  /**
   * 上传照片的函数
   */
  uploadAllImage: function (directory, imageUrl) {
    var that = this;
    
    wx.uploadFile({
      url: basepath + '/upload/image', 
      filePath: imageUrl,
      name: 'file',
      formData: {
        'directory': directory
      },
      success: function (res) {
        var data = res.data
        console.log("上传照片成功" + res.data)
      },
      fail: function(e) {
        console.log("上传初次失败")
        console.log(e)
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})