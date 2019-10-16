import api from "../../data/api";
import NT from "../../utils/native.js"
import QR from "../../utils/qrcode.js"
// pages/views/ticket-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleFrom: {}, //请求详情参数
    orderData: {}, //订单信息

    canvasHidden:false,
    maskHidden:true,
    imagePath:'',
    placeholder: '',  //默认二维码生成文本

    vipType: [ //会员类型
      {
        type: '1',
        bgPath: '/images/vip/vip_card1.png',
        name: 'Macau Time会员'
      },
      // {
      //   type: '2',
      //   bgPath: '/images/vip/vip_card2.png',
      //   name: 'Macau Time体验会员'
      // }
    ],
    userInfo: wx.getStorageSync("userInfo"), //用户信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    // console.log(options)
    this.data.roleFrom = options
    this.getOrderDetails()
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
    this.getUserInfo()
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  //获取用户信息
  getUserInfo() {
    const userFrom = {
      loginType: '1',
      phone: this.data.userInfo.phone,
      type: '1'
    }
    api.getUserInfo(userFrom)
    .then(res=>{
      console.log(res)
      const userInfo = Object.assign(wx.getStorageSync("userInfo")||{},res)
      this.setData({
        userInfo: userInfo
      })
      wx.setStorage({
        key:"userInfo",
        data:userInfo
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  //跳转到会员中心重新开通
  tapToJoinVip() {
    wx.navigateTo({
      url: '/pages/views/vip-center'
    })
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  //请求详情
  getOrderDetails() {
    api.getOrderDetails(this.data.roleFrom)
    .then(res=>{
      const data = res;
      data.chargeOffCodeStr = res.chargeOffCode ? res.chargeOffCode.replace(/(.{4})/g, "$1 ") : ''
      // 页面初始化 options为页面跳转所带来的参数
      // var size = this.setCanvasSize();//动态设置画布大小
      // var initUrl = this.data.placeholder;
      // this.createQrCode('gh-'+data.chargeOffCode, "mycanvas", size.w, size.h);
      this.setData({
        orderData: data,
        // maskHidden:true
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  //适配不同屏幕大小的canvas
  setCanvasSize:function(){
    var size={};
    try {
        var res = wx.getSystemInfoSync();
        var scale = 750/686;//不同屏幕下canvas的适配比例；设计稿是750宽
        var width = res.windowWidth/scale;
        var height = width;//canvas画布为正方形
        size.w = width;
        size.h = height;
      } catch (e) {
        // Do something when catch error
        console.log("获取设备信息失败"+e);
      } 
    return size;
  } ,
  createQrCode:function(url,canvasId,cavW,cavH){
    //调用插件中的draw方法，绘制二维码图片
    QR.api.draw(url,canvasId,cavW,cavH);
    setTimeout(() => { this.canvasToTempImage();},250);
    
  },
  //获取临时缓存照片路径，存入data中
  canvasToTempImage:function(){
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas',
      success: function (res) {
          var tempFilePath = res.tempFilePath;
          console.log(tempFilePath);
          that.setData({
              imagePath:tempFilePath,
             // canvasHidden:true
          });
      },
      fail: function (res) {
          console.log(res);
      }
    });
  },
  //点击图片进行预览，长按保存分享图片
  previewImg:function(e){
    var img = this.data.imagePath;
    console.log(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: [img] // 需要预览的图片http链接列表
    })
  },
})