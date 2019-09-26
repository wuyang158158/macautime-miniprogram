// pages/views/set-meal.js
import api from "../../data/api"
import NT from "../../utils/native.js"
import util from "../../utils/util.js"
const time = util.formatTimeTwo(new Date().toLocaleDateString(),'Y-M-D') //今日时间
const app = getApp();
var dataObj = {
  useDate: time, //选中的日期
  mealCalendar: null, // 套餐日历
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isIphoneX: app.globalData.isIphoneX, //iphonex适配
    userInfo: wx.getStorageSync("userInfo"), //用户信息
    orderCount: 1, // 订单数量默认为1
    showDialog: false,

    // 此处为日历自定义配置字段
    calendarConfig: {
      /**
       * 初始化日历时指定默认选中日期，如：'2018-3-6' 或 '2018-03-06'
       * 初始化时不默认选中当天，则将该值配置为false。
       */
      defaultDay: time,
      multi: false, // 是否开启多选,
      theme: 'elegant', // 日历主题，目前共两款可选择，默认 default 及 elegant，自定义主题在 theme 文件夹扩展
      showLunar: false, // 是否显示农历，此配置会导致 setTodoLabels 中 showLabelAlways 配置失效
      inverse: false, // 单选模式下是否支持取消选中,
      takeoverTap: false, // 是否完全接管日期点击事件（日期不会选中），配合 onTapDay() 使用
      disablePastDay: true, // 是否禁选过去的日期
      // firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: true, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    }
  },
  /**
   * 选择日期后执行的事件
   * currentSelect 当前点击的日期
   * allSelectedDays 选择的所有日期（当mulit为true时，allSelectedDays有值）
   */
  afterTapDay(e) {
    console.log('afterTapDay', e.detail); // => { currentSelect: {}, allSelectedDays: [] }
    // this.calendar.jump(e.detail.year, e.detail.month, e.detail.day);
    const data = {
      detail: e.detail.year + '-' + this.p(e.detail.month) + '-' + this.p(e.detail.day)
    }
    this.select(data)
  },
  /**
   * 当改变月份时触发
   * current 当前年月
   * next 切换后的年月
   */
  whenChangeMonth(e) {
    console.log('whenChangeMonth', e.detail); // => { current: { month: 3, ... }, next: { month: 4, ... }}
  },
  /**
   * 日期点击事件（此事件会完全接管点击事件），需自定义配置 takeoverTap 值为真才能生效
   * currentSelect 当前点击的日期
   */
  onTapDay(e) {
    console.log('onTapDay', e.detail); // => { year: 2019, month: 12, day: 3, ...}
  },
  /**
   * 日历初次渲染完成后触发事件，如设置事件标记
   */
  afterCalendarRender(e) {
    console.log('afterCalendarRender', e);
    // console.log(dataObj)
    this.getMealCalendar()
  },
  p(s) { //补零操作
    return s < 10 ? '0' + s: s;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    // 监听expAllMeal事件，获取上一页面通过eventChannel传送到当前页面的数据
    const eventChannel = this.getOpenerEventChannel()
    // 接受上一个页面传递过来的数据
    eventChannel.on('params', data => {
      // console.log(data)
      this.setData({
        expAllMeal: data.expAllMeal,
        acData: data.acData,
        mealSerial: options.mealSerial,
        userInfo: wx.getStorageSync("userInfo"), //用户信息
      })
      this.getMealDetails()
      // this.getMealCalendar()
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
  // 选中当日
  select: function (e) {
    console.log(e)
    dataObj.useDate = e.detail
    if(dataObj.mealCalendar){
      this.setData({
        repertory: dataObj.mealCalendar[dataObj.useDate] || 0,
        orderCount: 1
      })
      this.computedPrice()
    }
    
  },
  tapOrderDelete() { //减少订单
    this.setData({
      orderCount: this.data.orderCount > 1 ? this.data.orderCount - 1 : 1
    })
    this.computedPrice()
  },
  tapOrderAdd() { //增加订单
    if(this.data.orderCount === this.data.repertory){
      NT.showToastNone('已是最大库存！',1000)
      return
    }
    if(this.data.result.numberLimit!==0 && (this.data.orderCount >= this.data.result.numberLimit)){
      NT.showToastNone('不能超过限购数量！',1000)
      return
    }
    this.setData({
      orderCount: this.data.orderCount + 1
    })
    this.computedPrice()
  },
  //计算价格
  computedPrice() {
    const result = this.data.result;
    const orderCount = this.data.orderCount;
    const price = result.price * orderCount;
    const vipPrice = result.vipPrice * orderCount
    this.setData({
      price: price.toFixed(2),
      vipPrice: vipPrice.toFixed(2)
    })
  },
  openDialog: function () {
    this.setData({
        istrue: true
    })
  },
  // 关闭half-screen-dialog
  closeDialog(e){
    this.setData({
      istrue: false
    })
  },
  // 切换套餐
  tapChangMeal(e) {
    const mealSerial = e.currentTarget.dataset.mealserial
    if(mealSerial === this.data.mealSerial){
      return
    }
    this.setData({
      mealSerial: mealSerial
    })
    NT.showToast('处理中...')
    this.getMealDetails()
    this.getMealCalendar()
  },
  // 获取套餐详情
  getMealDetails() {
    const mealSerial = this.data.mealSerial
    if(!mealSerial){
      NT.showToastNone('请选择正确的套餐！',1000)
      return
    }
    const mealDetailsForm = {
      expMealSerial: mealSerial,
      expSerial: this.data.acData.experienceSerial
    }
    api.getMealDetails(mealDetailsForm)
    .then(res=>{
      this.setData({
          result: res
      })
      this.computedPrice()
    })
    .catch(err=>{
      NT.showModal(err.codeMsg||err.message||'请求失败！')
    })
  },
  // 获取体验套餐日历
  getMealCalendar() {
    const mealSerial = this.data.mealSerial
    const mealCalendarForm = {
      expSerial: this.data.acData.experienceSerial,
      mealSerial: mealSerial
    }
    api.getMealCalendar(mealCalendarForm)
    .then(res=>{
      dataObj.mealCalendar = res || {}
      this.setData({
        repertory: dataObj.mealCalendar[dataObj.useDate]
      })

      var days = []
      Object.keys(res).forEach((key)=>{
        // console.log(key,res[key]);
        const daysObj = {
          year: key.split('-')[0],
          month: key.split('-')[1],
          day: key.split('-')[2],
          todoText: res[key] + '件'
        }
        days.push(daysObj)
      });
      // console.log(days)
      this.calendar.clearTodoLabels();
      this.calendar.setTodoLabels({
        // 待办点标记设置
        pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
        dotColor: '#40', // 待办点标记颜色
        circle: false, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
        showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
        days: days
      })
      var mealEndTime = Object.keys(res).sort().pop()
      this.calendar.enableArea([time, mealEndTime])


    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 提交订单
  tapToSubmitOrder() {
    if(!this.data.repertory){
      NT.showModal('暂无库存！')
      return
    }
    const acData = this.data.acData
    const params = {
      expSerial: acData.experienceSerial,
      coverUrl: acData.coverUrl,
      activityTitle: acData.activityTitle,
      originalPrice: this.data.result.price,
      discount: acData.discount,
      newOriginalPrice: this.data.result.vipPrice,
      orderCount: this.data.orderCount,
      expMealSerial: this.data.mealSerial,
      useDate: dataObj.useDate,
      paymentType: acData.paymentType,
      symbol: acData.symbol
    }
    wx.navigateTo({
      url: '/pages/views/submit-order',
      success: function(result) {
        // 通过eventChannel向被打开页面传送数据
        result.eventChannel.emit('params', params)
      }
    })
  },
})