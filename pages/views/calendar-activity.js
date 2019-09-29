// pages/views/calendar-activity.js
import api from "../../data/api";
import NT from "../../utils/native.js"
import PAGE from "../../utils/config.js"
import util from "../../utils/util.js"
const time = util.formatTimeTwo(new Date(),'Y-M-D') //今日时间
const stime = new Date(time).getTime()
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
      disablePastDay: false, // 是否禁选过去的日期
      // firstDayOfWeek: 'Mon', // 每周第一天为周一还是周日，默认按周日开始
      onlyShowCurrentMonth: false, // 日历面板是否只显示本月日期
      hideHeadOnWeekMode: false, // 周视图模式是否隐藏日历头部
      showHandlerOnWeekMode: true // 周视图模式是否显示日历头部操作栏，hideHeadOnWeekMode 优先级高于此配置
    },
    recommend: [], // 今日推荐
    params: { //请求首页推荐列表
      limit: PAGE.limit,
      start: PAGE.start,
      paramEntity: {
        stime: stime,
        userName: wx.getStorageSync("userInfo").userName
      }
    },
    total: 0,
    loadmore: false, //加载更多
    loadmoreLine: false, //暂无更多信息
    todayAc: [], // 今日体验
    journey: {}, //我的行程
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
    this.getMyJourney()
  },
  p(s) { //补零操作
    return s < 10 ? '0' + s: s;
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    NT.showToast('加载中...')
    this.select({detail:time})
    this.getGuessLike()
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
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          stime: this.data.params.paramEntity.stime,
          userName: wx.getStorageSync("userInfo").userName
        }
      },
      loadmoreLine: false,
      loadmore: false
    })
    this.getExpCalendar('onPullDownRefresh')
    this.getGuessLike()
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
      this.setData({
        params:{ //请求首页推荐列表
          limit: PAGE.limit,
          start: this.data.params.start + 1,
          paramEntity: {
            stime: this.data.params.paramEntity.stime,
            userName: wx.getStorageSync("userInfo").userName
          }
        }
      })
      this.getExpCalendar()
    }
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {

  // },
  // 选中当日
  select: function (e) {
    const selectVal = e.detail.replace(/\-/g,'\/') //-情况下，iphone无法正常正常解析数据
    this.setData({
        selectVal:e.detail
    })
    NT.showToast('加载中...')
    this.setData({
      params: { //请求首页推荐列表
        limit: PAGE.limit,
        start: PAGE.start,
        paramEntity: {
          stime: new Date(selectVal + ' 00:00:00').getTime(),
          userName: wx.getStorageSync("userInfo").userName
        }
      },
      todayAc: [],
      loadmoreLine: false,
      loadmore: false
    })
    this.getExpCalendar()
  },
  // 获取今日体验
  getExpCalendar(source) {
    console.log(JSON.stringify(this.data.params))
    api.getExpCalendar(this.data.params)
    .then(res=>{
      const data = res.rows
      data.map(item => {
        // debugger
        item.stime = util.formatTimeTwo(item.stimeStr || item.stime,'Y/M/D')
        item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      })
      this.setData({
        todayAc: source === 'onPullDownRefresh' ? data : this.data.todayAc.concat(data),
        total: res.count,
        loadmore: false
      })
    })
    .catch(err=>{
      console.log(err)
      this.setData({
        loadmore: false,
      })
    })
  },
  //获取猜你喜欢推荐数据
  getGuessLike() {
    api.getGuessLike()
    .then(res=>{
      const data = res
      data.map(item => {
        // debugger
        item.stime = util.formatTimeTwo(item.stimeStr,'Y/M/D')
        item.activityTag = item.activityTag ? item.activityTag.split(',')[0] : ''
      })
      this.setData({
        recommend: data
      })
    })
    .catch(err=>{
      console.log(err)
    })
  },
  // 获取我的行程
  getMyJourney() {
    api.getMyJourney()
    .then(res=>{
      const data = res
      const allDate = data.allDate
      this.setData({
        journey: data
      })
      // 待办点标记设置
      var days = []
      allDate.map(item=>{
        const daysObj = {
          year: item.split('-')[0],
          month: item.split('-')[1],
          day: item.split('-')[2]
        }
        days.push(daysObj)
      })
      this.calendar.setTodoLabels({
        // 待办点标记设置
        pos: 'bottom', // 待办点标记位置 ['top', 'bottom']
        dotColor: '#40', // 待办点标记颜色
        // circle: true, // 待办圆圈标记设置（如圆圈标记已签到日期），该设置与点标记设置互斥
        showLabelAlways: true, // 点击时是否显示待办事项（圆点/文字），在 circle 为 true 及当日历配置 showLunar 为 true 时，此配置失效
        days: days
      })
    })
    .catch(err=>{
      console.log(err)
    })
  }
})