// pages/views/personal-home.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
import bmap from "../../utils/bmap-wx.min.js"
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navArray: [
      {
        name: '相册',
        number: 24,
        selected: true
      },
      {
        name: '视频',
        number: 12,
        selected: false
      },
      {
        name: '已发布',
        number: 8,
        selected: false
      }
    ],
    index: 0,

    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求首页推荐列表
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {}
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    noData: false,  //没有数据时
    recommend: [], // 首页推荐体验列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.getExperience()
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
  onPullDownRefresh: function() {
    NT.showToast('刷新中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {}
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.getExperience('onPullDownRefresh')
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // NT.showToast('加载中...')
    if ((this.data.params.start) * this.data.params.limit < this.data.total) {
      wx.showNavigationBarLoading();
      this.setData({
        loadmoreLine: false,
        loadmore: true
      })
      this.setData({
        params:{ //请求首页推荐列表
          limit: PAGE.limit,
          start: this.data.params.start + 1,
          paramEntity: {}
        }
      })
      this.getExperience()
    }else {
      //暂无更多数据
      NT.hideToast()
      if(this.data.recommend.length){
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
  // 切换菜单栏
  tapNavArray(e) {
    const index = e.currentTarget.dataset.index
    const navArray = this.data.navArray
    if(index===this.data.index){
      return false;
    }
    navArray.map((item,i)=>{
      i===index ? item.selected = true : item.selected = false
    })
    this.setData({
      navArray: navArray,
      index: index
    })
  },
  //获取推荐列表
  getExperience(source) {
    let that = this
    api.getExperience(that.data.params)
    .then(res=>{
      let data = res.rows || []
      data.map(item => {
        // debugger
        item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D')
        item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      })
      that.setData({
        noData: false,
        recommend: source === 'onPullDownRefresh' ? data : this.data.recommend.concat(data),
        total: res.total,
        loadmore: false
      })
      if(!that.data.recommend.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
    .catch(err=>{
      console.log(err)
      NT.showModal(err.codeMsg||err.message||'请求失败！')
      this.setData({
        loadmore: false,
      })
      if(!that.data.recommend.length>0){ //暂无数据
        that.setData({
          noData: true
        })
      }
    })
  },
})