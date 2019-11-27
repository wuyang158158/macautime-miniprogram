// pages/route/choose-merchant.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
import bmap from "../../utils/bmap-wx.min.js"
const app = getApp()
const titleBar = [ //顶部标题bar
  {
    name: '全部',
    type: 'A'
  },
  {
    name: '美食',
    type: 'B'
  },
  {
    name: '休闲',
    type: 'C'
  },
  {
    name: '丽人',
    type: 'D'
  },
  {
    name: '亲子',
    type: 'E'
  },
  {
    name: '演出',
    type: 'F'
  },
  {
    name: '文艺',
    type: 'F'
  }
];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    titleBar: titleBar, //顶部标题bar
    name: titleBar[0].name, // 选中标题bar,默认第一位
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  //搜索事件
  search(e) {
    console.log(e)
  },
  //跳转搜索中心
  tapSearch() {
    wx.navigateTo({
      url: '/pages/views/search-center'
    })
  },
  tapToMapActivity() { // 点击进入活动地图
    wx.navigateTo({
      url: '/pages/views/map-activity'
    })
  },
  //点击tabbbar事件
  tapTitleBar: function(e){
    let name = e.currentTarget.dataset.name,
        type = e.currentTarget.dataset.type,
        t = this;
        if(name===this.data.name){
          return
        }
        // NT.showToast('加载中...');
        // wx.pageScrollTo({
        //   scrollTop: 0,
        //   duration: 300
        // })
        t.setData({
          name:name,
          // ticketData: [],
          // loadmoreLine: false,
          // loadmore: false
        })
        // this.data.params = { //请求订单列表
        //   limit: PAGE.limit,
        //   start: PAGE.start,
        //   paramEntity: {
        //     status: type,  //A:待使用 B:已验票 C:已完成 D:已取消 ,
        //     userName: wx.getStorageSync("userInfo").userName
        //   }
        // };
        // this.getOrderListPersonal()
  },
  toDetail() {
    wx.navigateTo({
      url: '/pages/route/choose-merchant-setmeal'
    })
  }
})