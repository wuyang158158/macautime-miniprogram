// pages/views/search-center.js
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import api from "../../data/api.js"
import util from "../../utils/util.js"
const menuData = [
  '路线','商家','用户'
]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    params: { //请求首页推荐列表
      limit: PAGE.limit,
      start: PAGE.start,
      keyWord: ''
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    noData: false,  //没有数据时
    recommend: [], // 首页推荐体验列表

    menuData: menuData,
    menuDataIndex: 0,
    merchantParams: {
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {
        userName: wx.getStorageSync("userInfo").userName
      }
    },
    result: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    this.setData({
      userInfo: wx.getStorageSync("userInfo"), //用户信息
    })
    this.hostSearch()
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
   
  onPullDownRefresh: function () {
    NT.showToast('刷新中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          activityTitle: this.data.params.keyWord
        }
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.msSelectedMsByKeyWord('onPullDownRefresh')
  },
  */

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
      this.setData({
        params:{ //请求首页推荐列表
          limit: PAGE.limit,
          start: this.data.params.start + 1,
          keyWord: this.data.params.keyWord
        }
      })
      this.msSelectedMsByKeyWord()
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
  tapHostSearch(e) {
    const content = e.currentTarget.dataset.content
    this.setData({
      inputVal: content
    })
    this.data.params.keyWord = content
    this.msSelectedMsByKeyWord('onPullDownRefresh')
  },
  // 搜索
  search(e) {
    console.log(e)
    if(e.detail){
      // this.getLikeage(e.detail)
      // 商家搜索
      // if(this.data.menuDataIndex === 1){
      //   this.msSelectedMsByKeyWord(e.detail)
      // }
      this.data.params.keyWord = e.detail
      this.msSelectedMsByKeyWord()
    }else{
      this.setData({
        associativeWords: [],
        recommend: [],
        noData: false
      })
    }
    
  },
  bindconfirm(e) {
    if(e.detail){
      this.setData({
        associativeWords: []
      })
      this.data.params.keyWord = e.detail
      this.msSelectedMsByKeyWord('onPullDownRefresh')
    }
    
  },
  // 联想词
  getLikeage(e) {
    NT.showToast('处理中...')
    api.getLikeage({name: e})
    .then(res=>{
      console.log(res)
      if(!res.length>0){
        this.data.params.keyWord = e
        this.msSelectedMsByKeyWord('onPullDownRefresh')
      }else{
        res.map(item=>{
          const name = item.name
          if(name.indexOf(e) !== -1){
            const content = name.replace(new RegExp(e,'g'),'<span class="c-00A653">'+e+'</span>')
            item.content = '<p>' + content + '</p>'
          }
        })
        this.setData({
          associativeWords: res,
          recommend: [],
          noData: false
        })
      }
    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 热搜词请求
  hostSearch() {
    this.setData({
      historyRecord: wx.getStorageSync('historyRecord') || []
    })
    api.hostSearch()
    .then(res=>{
      // console.log(res)
      this.setData({
        hostSearch: res
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 清空搜索历史记录
  tapClearRecord() {
    wx.removeStorageSync('historyRecord')
    this.setData({
      historyRecord: []
    })
  },
  //缓存处理
  historyRecordStorage() {
    const keyWord = this.data.params.keyWord
    if(!keyWord){
      return
    }
    var historyRecord = wx.getStorageSync('historyRecord') || []
    //去重
    if(historyRecord.length){
      historyRecord.map((item,index)=>{
        if(item===keyWord){
          historyRecord.splice(index,1)
        }
      })
    }
    //超过8个处理
    if(historyRecord.length>7){
      historyRecord = historyRecord.slice(0,7)
    }
    historyRecord.unshift(keyWord)
    wx.setStorage({
      key:"historyRecord",
      data: historyRecord
    })
    this.setData({
      historyRecord: historyRecord
    })
  },
  //获取推荐列表
  msSelectedMsByKeyWord(source) {
    let that = this
    //历史记录处理
    this.historyRecordStorage()
    api.msSelectedMsByKeyWord(that.data.params)
    .then(res=>{
      let data = res.data || []
      // data.map(item => {
      //   // debugger
      //   item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D')
      //   item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      // })
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
  // 点击菜单切换
  tapSMenuItem(e) {
    const index = e.currentTarget.dataset.index;
    // if(index === 1){
    //   NT.showToast('处理中...')
    //   this.getUserRecord()
    // }

    this.setData({
      menuDataIndex: index
    })
    // wx.pageScrollTo({
    //   scrollTop: 0,
    //   duration: 300
    // })
    // this.setData({
    //   recommend: [],
    //   loadmoreLine: false,
    //   loadmore: false
    // })
    // this.data.params = { //请求订单列表
    //   limit: PAGE.limit,
    //   start: PAGE.start,
    //   keyWord: this.data.params.keyWord
    // };
    // this.getOrderListPersonal()
    if(index === 1){ //商家搜索
      // this.msSelectedMsByKeyWord()
    }
  },

  getUserRecord(source) { // 请求用户记录
    api.getUserRecord(this.data.merchantParams)
    .then(res=>{
      // console.log(res)
      const data = source === 'onPullDownRefresh' ? res.rows : this.data.result.concat(res.rows)
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