/**
 * api数据控制器
 */
import config from './api_config.js'
import utils from '../utils/util.js'
import NT from '../utils/native.js'

const app = getApp()
const env = config.env[config.curEnv]
const baseUrl = env.baseUrl

const mapObj = {
  ak: 'yGcrSwdG3beEibxivQuiShqGQxp4BSqc' //地图key
}

/**
 * 公共request方法(登录后接口调用)
 * @param url 请求接口地址
 * @param method 请求接口方式
 * @param params 请求参数
 * @param callback 请求成功回调
 */
const execute = (url, method, params, resolve, reject) => {
  const token = wx.getStorageSync('userInfo').token || ''
  const obj = { userName: wx.getStorageSync('userInfo').userName || '' }
  const data = Object.assign(params || {}, obj)
  wx.request({
    url: baseUrl + url,
    method: method,
    data: data,
    header: {
      'content-type': 'application/json', // 默认值
      Authorization: 'Basic Yml4aW46Qml4aW5AMjAxOA==',
      token: token,
      loginType: 1
    },
    dataType: 'json',
    success: res => {
      NT.hideToast()
      // console.log(res)
      const result = res.data.data
      if(url==='/user/user/wxMiniProgramLogin'&&result&&result.isRegistered!==undefined&&!result.isRegistered){ //未注册
        wx.removeStorageSync('userInfo')
        reject({
          code: '10019',
          data: result
        })
        return
      }
      if (res.statusCode === 401) {
        //需要校验用户信息
        reject({
          code: '401',
          codeMsg: '暂未登录'
        })
        NT.showToastNone('需要登录！')
        // wx.switchTab({
        //   url: '/pages/tabs/center'
        // })
        if(getApp()){
          NT.showToast('登录中...')
          getApp().login()
        }
        return
      }
      if (res.data.code === '00000') {
        resolve(result)
      } else {
        reject(res.data)
      }
    },
    fail: res => {
      NT.hideToast()
      reject({
        code: '00',
        codeMsg: '请求失败，请检查您的网络连接。'
      })
      // NT.showModal('请求失败，请检查您的网络连接。')
    }
  })
}
/**
 * 公共request方法(登录后接口调用)  请求百度地图定位信息
 */
const executeBdMap = (url, method, params, resolve, reject) => {
  wx.request({
    url: url + '?ak=yGcrSwdG3beEibxivQuiShqGQxp4BSqc&location=' + params.latitude + ',' + params.longitude + '&output=json',
    method: method,
    data: {},
    header: {
      'content-type': 'application/json', // 默认值
    },
    dataType: 'json',
    success: res => {
      resolve(res)
    },
    fail: res => {
      reject(res)
    }
  })
}

/**
 * 公共WebSocket方法
 */
const socket = (url, method, params, source, callback) => {
  let token = wx.getStorageSync('sie_iot_user_token')
  const ws = wx.connectSocket({
    url: wssBaseUrl + url,
    data: dealParam(params),
    header: {
      Authorization: `Basic dXNlcjpwYXNzd29yZA==`,
      'content-type': 'application/json'
    },
    //子协议
    // protocols: [],
    method: method,
    success: res => {
      callback(ws, res)
    },
    fail: res => {
      NT.showModal('请求失败，请检查您的网络连接。')
    }
  })
  ws.onOpen(res => {
    source.wsController(ws)
  })
}

export default {
  ENV_CONFIG: config.curEnv,
  /**
   * 图片上传
   */
  uploadImage(filePath,params) {
    // console.log(filePath)
    let uploads=[];
    const url = config.env[config.curEnv].baseUrl + `/experience/expCMNT/expCommentUploadImg`
    const obj = { userName: wx.getStorageSync('userInfo').userName || '' }
    const token = wx.getStorageSync('userInfo').token || ''
    const formData = Object.assign(params || {}, obj)
    return new Promise(resolve => {
      for(var i=0;i<filePath.length;i++){
        uploads[i] = new Promise(resolve1 => {
          wx.uploadFile({
            url: url,
            header: {
              'content-type': 'application/json', // 默认值
              Authorization: 'Basic Yml4aW46Qml4aW5AMjAxOA==',
              token: token,
              loginType: 1
            },
            filePath: filePath[i],
            formData: formData,
            name: 'file',
            success: res => {
              // console.log('上传成功')
              const data = JSON.parse(res.data)
              resolve1(data)
            },
            fail: err => {
              console.log(err)
              NT.showModal(err)
            }
          })
        })
      }
      Promise.all(uploads).then((result)=>{
        // console.log('上传成功Promise')
        // console.log(result)
        resolve(result)
      })
    })
    /*
    return new Promise(resolve => {
      wx.uploadFile({
        url: config.env[config.curEnv].baseUrl + `/experience/expCMNT/expCommentImg`,
        header: {
          'content-type': 'application/json', // 默认值
          Authorization: 'Basic Yml4aW46Qml4aW5AMjAxOA==',
          token: token,
          loginType: 1
        },
        filePath: filePath,
        formData: formData,
        name: 'file',
        success: res => {
          console.log('上传成功')
          resolve(res)
        },
        fail: err => {
          console.log(err)
          NT.showModal(err)
        }
      })
    })
    */
  },
  // 登录
  login() {
    return new Promise((resolve, reject) => {
      // execute(`/user/user/wxMiniProgramLogin`, 'POST', query, resolve,reject)
      wx.login({
        success(res) {
          if (res.code) {
            const query = { code: res.code }
            //发起网络请求
            execute(
              `/user/user/wxMiniProgramLogin`,
              'POST',
              query,
              resolve,
              reject
            )
          } else {
            reject('登录失败！')
          }
        }
      })
    })
  },
  // 注册
  register(query) {
    return new Promise((resolve, reject) => {
      execute(`/user/user/wxRegistered`, 'POST', query, resolve, reject)
    })
  },
  // 获取所有体验产品
  getExperience(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getExperience`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取会员限时礼接口
  getLimitTimeGift(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getLimitTimeGift`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取会员专属体验接口
  getVipExperience(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getVipExperience`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //获取体验详情接口
  getExpDetails(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getExpDetails`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //猜你喜欢推荐接口
  getGuessLike(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getGuessLike`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //提交订单接口
  saveOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/saveOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //获取个人订单列表
  getOrderListPersonal(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/getOrderListPersonal`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //获取订单详情
  getOrderDetails(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/getOrderDetails`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 购买会员
  payVipOrder(query) {
    return new Promise((resolve, reject) => {
      execute(`/payment/vipPay/payVipOrder`, 'POST', query, resolve, reject)
    })
  },
  //获取用户信息
  getUserInfo(query) {
    return new Promise((resolve, reject) => {
      execute(`/user/user/getUserInfo`, 'POST', query, resolve, reject)
    })
  },
  //获取体验日历接口
  getExpCalendar(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getExpCalendar`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //取消订单
  cancelOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/cancelOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  //删除订单
  deleteOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/deleteOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 会员价格列表
  vipPriceList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/vipPrice/vipPriceList`,
        'GET',
        query,
        resolve,
        reject
      )
    })
  },
  //  获取我的行程
  getMyJourney(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/getMyJourney`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取用户的浏览记录接口
  getUserRecord(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/record/getUserRecord`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取体验活动接口
  getPromotions(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/promotion/getPromotions`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取当前城市
  getLocationCity(query) {
    return new Promise((resolve, reject) => {
      executeBdMap(
        `https://api.map.baidu.com/geocoder/v2/`,
        'GET',
        query,
        resolve,
        reject
      )
    })
  },
  // 点赞体验（点赞和取消点赞）
  likeExp(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/likeExp`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 我的点赞体验列表
  likeExpLike(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/likeExpLike`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取附近体验列表
  getNearExp(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/getNearExp`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 人气体验
  expRanking(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/expRanking`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取体验的套餐
  getExpAllMeal(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/meal/getExpAllMeal`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取套餐详情
  getMealDetails(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/meal/getMealDetails`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取套餐时间表
  getMealCalendar(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/meal/getMealCalendar`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 体验线上支付
  payOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/payment/expPay/payOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 体验评论
  expComment(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/expCMNT/expComment`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 查询体验评论
  queryExpComment(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/expCMNT/queryExpComment`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 我的评论
  myComment(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/expCMNT/myComment`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 协议政策等
  getClerkByType(query){
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/clerkApi/getClerkByType`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 搜索联想词
  getLikeage(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/module/getLikeage`,
        'GET',
        query,
        resolve,
        reject
      )
    })
  },
  // 热搜词汇
  hostSearch(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/baseService/base/hostSearch`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  }
  /*** file-end ***/
}
