// pages/my/my-focus-kol.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求订单列表
      limit: PAGE.limit,
      start: PAGE.start,
      // paramEntity: {
      //   userName: wx.getStorageSync("userInfo").userName
      // }
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息

    result: [],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      params: { //请求列表
        limit: PAGE.limit,
        start: PAGE.start,
        // paramEntity: {
        //   userName: wx.getStorageSync("userInfo").userName
        // }
      },
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    NT.showToast('加载中...')
    this.getFocusList()
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
    NT.showToast('刷新中...')
    this.setData({
      userInfo: wx.getStorageSync("userInfo"),
      params: { //请求列表
        limit: PAGE.limit,
        start: PAGE.start,
        // paramEntity: {
        //   userName: wx.getStorageSync("userInfo").userName
        // }
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.getFocusList('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if ((this.data.params.start) * this.data.params.limit < this.data.total) {
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.data.params.start = this.data.params.start + 1;
      this.getFocusList()
    }else {
      //暂无更多数据
      NT.hideToast()
      if(this.data.result.length){
        this.setData({
          loadmoreLine: true,
          loadmore: false
        })
      }else{
        this.setData({
          loadmore: false
        })
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  getFocusList(source) { // 请求用户记录
    api.getFocusList(this.data.params)
    .then(res=>{
      // console.log(res)
      const data = source === 'onPullDownRefresh' ? res.data : this.data.result.concat(res.data)
      // let timeText = ''
      // data.forEach(item => {
      //   item.createTimeStr = util.formatTimeTwo(item.creatTimeStamp?item.creatTimeStamp:item.createTime || '','Y年M月D日')
      //   if (timeText == item.createTimeStr) {
      //     item.createTimeStr = null;
      //   } else {
      //     timeText = item.createTimeStr;
      //   }
      // })
      this.setData({
        result: data,
        total: res.total,
        loadmoreLine: false,
        loadmore: false,
        noData: false,
      })
      if(!this.data.result.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
    })
    .catch(err=>{
      console.log(err)
      this.setData({
        loadmore: false,
      })
      if(err.code === '401'){
        this.setData({
          emptytext: err.codeMsg
        })
      }else{
        NT.showModal(err.codeMsg||err.message||'请求失败！')
      }
      if(!this.data.result.length>0){ //暂无数据
        this.setData({
          noData: true
        })
      }
    })
  },
})