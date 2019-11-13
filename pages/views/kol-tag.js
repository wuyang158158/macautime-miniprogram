// pages/views/kol-tag.js
import api from "../../data/api";
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tagArray: [
      {
        name: '旅游博主',
        selected: false
      }, 
      {
        name: '摄影达人',
        selected: false
      }, 
      {
        name: '城市探店',
        selected: false
      }, 
      {
        name: '美食达人',
        selected: false
      },
      {
        name: '游记撰写',
        selected: false
      }],
    tagSelectedLen: 0
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
  // 新增标签
  tapToAddTag() {
    console.log('新增标签')
    this.setData({
      isShowConfirm: true
    })
  },
  // 输入绑定
  bindinput(e) {
    console.log(e)
  },
  confirm(e) {
    const detail = e.detail.replace(/^\s+|\s+$/g,"")
    const tagArray = this.data.tagArray
    let flag = false
    tagArray.map(item=>{
      if(item.name===detail){
        NT.showToastNone('该标签已存在，请勿重复添加！')
        flag = true
      }
    })
    if(!flag){
      const obj = {
        name: detail,
        selected: false
      }
      this.setData({
        tagArray: this.data.tagArray.concat(obj)
      })
    }
    
  },
  // 点击标签
  tapTag(e) {
    var tagSelectedLen = this.data.tagSelectedLen
    const name = e.currentTarget.dataset.name
    const tagArray = this.data.tagArray
    tagArray.map(item=>{
      if(item.selected){
        tagSelectedLen += 1
      }
    })
    console.log(tagSelectedLen)
    if(tagSelectedLen>3){
      NT.showToastNone('优势特长标签不能超过3次！')
      return false;
    }

    

    tagArray.map(item=>{
      if(item.name===name){
        item.selected = !item.selected
      }
    })

    

    
    this.setData({
      tagArray: tagArray,
      tagSelectedLen: tagSelectedLen
    })
  },
  submitNext() { // 下一步
    wx.navigateTo({
      url: '/pages/views/kol-enter-msg'
    })
  }
})