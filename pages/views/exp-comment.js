// pages/views/exp-comment.js
import api from "../../data/api";
import NT from "../../utils/native.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      console.log(data)
      this.setData({
        options:data,
        mycomment: options.comment
      })
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

  // },
  bindFormSubmit(e) { // 提交意见反馈
    const textarea = e.detail.value.textarea
    const phone = e.detail.value.phone
    if(textarea===''){
      NT.showModal('请填写评价内容，才能发表哦！')
      return
    }
    NT.showToast('处理中...')
    const options = this.data.options
    const expCommentForm = {
      comment: textarea, //评论内容 
      expId: options.expSerial, //体验id 
      mealTitle: options.mealTitle, // 套餐类型
      mealSerial: options.mealSerial, // 套餐id
      orderCode: options.orderCode, //订单id
      coverImgUrl: options.coverImgUrl, //封面图
      activityTitle: options.activityTitle, //标题
      reply: '', //回复评论id 
      replyUsername: '' //被回复用户id 
    }
    api.expComment(expCommentForm)
    .then(res=>{
      console.log(res)
      // debugger
      if(!this.data.files.length>0){
        NT.toastFn('评论成功！',1000)
        if(this.data.mycomment === 'myexp'){
          wx.setStorage({
            key:"mycomment",
            data:"myexp"
          })
        }
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1000)
        return
      }
      NT.showToast('处理中...')
      const uploadImageForm = {
        commentId: res.commentId
      }
      api.uploadImage(this.data.files, uploadImageForm)
      .then(res=>{
        NT.toastFn('评论成功！',1000)
        if(this.data.mycomment === 'myexp'){
          wx.setStorage({
            key:"mycomment",
            data:"myexp"
          })
        }
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        },1000)
      })
      .catch(err=>{
        NT.showModal(err.codeMsg||err.message||'请求失败！')
      })
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
    // console.log(textarea)
    // console.log(phone)
    // const params = {
    //   file: this.data.files[1],
    //   file: this.data.files[2],
    //   expId: this.data.options.expId,
    //   comment: textarea
    // }
    // api.uploadImage(this.data.files[0],params)
    // .then(res=>{
    //   console.log(res)
    // })
    // .catch(err=>{
    //   console.log(err)
    // })
  },
  chooseImage: function (e) {
    var that = this;
    var files = this.data.files;
    wx.chooseImage({
        count: 9-files.length, // 最多可以选择的图片张数，默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
            that.setData({
                files: that.data.files.concat(res.tempFilePaths)
            });
        }
    })
  },
  previewImage: function(e){
      wx.previewImage({
          current: e.currentTarget.id, // 当前显示图片的http链接
          urls: this.data.files // 需要预览的图片http链接列表
      })
  }, 
})