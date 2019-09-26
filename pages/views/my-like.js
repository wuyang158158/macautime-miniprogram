// pages/views/my-like.
import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: { //请求订单列表
      mid: '',
      pageSize: PAGE.limit
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    onReachBottom: false,
    result: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      params: { //请求订单列表
        mid: '',
        pageSize: PAGE.limit
      },
    })
    NT.showToast('加载中...')
    this.likeExpLike()
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
      params: { //请求订单列表
        mid: '',
        pageSize: PAGE.limit
      },
      loadmoreLine: false,
      loadmore: false,
      onReachBottom: false
    })
    this.likeExpLike('onPullDownRefresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!this.data.onReachBottom){
      wx.showNavigationBarLoading();
      const args = this.data.result
      this.setData({
        params: { //请求订单列表
          mid: args[args.length - 1].mId,
          pageSize: PAGE.limit
        },
        loadmoreLine: false,
        loadmore: true
      })
      this.likeExpLike('onReachBottom')
    }
  },
  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
  likeExpLike(source) { // 请求数据记录
    api.likeExpLike(this.data.params)
    .then(res=>{
      // console.log(res)
      if(source === 'onReachBottom' && !res.length > 0){
        this.data.onReachBottom = true
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
        return
      }
      const data = source === 'onPullDownRefresh' ? res : this.data.result.concat(res)
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