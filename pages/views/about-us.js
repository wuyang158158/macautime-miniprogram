import api from "../../data/api"
import NT from "../../utils/native.js"

// pages/views/about-us.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    roleForm: { //1: 协议政策 2：Macau Time服务协议 3：关于我们 4：注册协议
      type: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    NT.showToast('加载中...')
    this.setData({
      roleForm: {
        type: options.id
      }
    })
    this.getClerkByType()
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
  getClerkByType() {
    api.getClerkByType(this.data.roleForm)
    .then(res=>{
      wx.setNavigationBarTitle({
        title: res.name
      })
      let content = res.content || ''
      content = content ? content.replace(/\<img/gi, '<img class="rich-img"') : ''
      this.setData({
        content: content
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  }

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // }
})