// pages/views/kol-tag.js
import api from "../../data/api";
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    tagArray: [],
    tagSelectedLen: 0,

    query:{ // 请求参数
      ext1: 'us'
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.sysLabelInfo()
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
      if(item.remark===detail){
        NT.showToastNone('该标签已存在，请勿重复添加！')
        flag = true
      }
    })
    if(!flag){
      const obj = {
        sysLabelList:[
          {
            id: null,
            accountId: this.data.userInfo.userId,
            labelTypeId: null, 
            labelTypeRemark: null,
            labelId: null,
            labelRemark: detail,
            weight: null,
            createTime: null,
            updateTime: null
          }
        ]
        
      }
      this.usInsertLabel(obj)
    }
    
  },
  // 点击标签
  tapTag(e) {
    var tagSelectedLen = this.data.tagSelectedLen
    const remark = e.currentTarget.dataset.remark
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
      if(item.remark===remark){
        item.selected = !item.selected
      }
    })

    

    
    this.setData({
      tagArray: tagArray,
      tagSelectedLen: tagSelectedLen
    })
  },
  submitNext() { // 下一步
    const tagArray = this.data.tagArray
    let choseTag = []
    tagArray.map(item=>{
      if(item.selected){
        choseTag.push(item)
      }
    })
    wx.setStorage({
      key:"choseTag",
      data:choseTag
    })
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取系统标签
  sysLabelInfo() {
    NT.showToast('加载中...')
    api.sysLabelInfo(this.data.query)
    .then(res=>{
      const usSysLabel = res.usSysLabel
      usSysLabel.map(item=>{
        item.remark = item.labelRemark
      })
      let data = res.sysLabel.concat(usSysLabel)
      data.map(item=>{
        item.selected = false
      })
      var choseTag = wx.getStorageSync('choseTag')
      if(choseTag.length){
        for (let index = 0; index < choseTag.length; index++) {
          const element = choseTag[index];
          data.map(item=>{
            if(item.id === element.id){
              item.selected = true
            }
          })
        }
      }
      this.setData({
        tagArray: data
      })
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
  },
  // 新增标签
  usInsertLabel(obj) {
    NT.showToast('处理中...')
    api.usInsertLabel(obj)
    .then(res=>{
      obj.remark = obj.sysLabelList[0].labelRemark,
      obj.selected = false
      this.setData({
        tagArray: this.data.tagArray.concat(obj)
      })
    })
    .catch(err=>{
      NT.showModal(err.message||'请求失败！')
    })
  }
})