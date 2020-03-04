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

const header = {
  'content-type': 'text/DM-', // 默认值
  // Authorization: 'Basic Yml4aW46Qml4aW5AMjAxOA==',
  auth: wx.getStorageSync('userInfo').auth || '' ,
  // token: token,
  // loginType: 1
}
const upImgHeader = {
  'content-type': 'multipart/form-data',
  auth: wx.getStorageSync('userInfo').auth || '' ,
}

const global = {
  appType: 1,  // appType  1-用户 2-商户
  appVersion: '',
  deviceMode: 3, //deviceMode   1-IOS 2-Android 3-小程序
  sellerId: '', 
  userId: wx.getStorageSync('userInfo').userId || ''
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
  // const data = Object.assign(params || {}, obj)

  // const body = {
  //   "password":"123456","account":"18168723160","verCode":"1"
  // }
  const body = params || {}
  wx.request({
    url: baseUrl + url,
    method: method,
    data: {body,global},
    // data: data,
    header: header,
    dataType: 'json',
    success: res => {
      NT.hideToast()
      const result = res.data.body
      // if(url === '/usRegist/1.0/'&&result.openId === 'oBV8p4yY71L8CE18QD7KDq_ydfWM'){
      //   // 打开调试
      //   wx.setEnableDebug({
      //     enableDebug: true
      //   })
      // }
      if(url==='/usRegist/1.0/'&&!result.register){ //未注册
        wx.removeStorageSync('userInfo')
        reject({
          code: '10019',
          data: {
            openId: result.openId,
            sessionKey: result.sessionKey
          }
        })
        return
      }
      // if (res.statusCode === 401) {
      //   //需要校验用户信息
      //   reject({
      //     code: '401',
      //     codeMsg: '暂未登录'
      //   })
      //   NT.showToastNone('需要登录！')
      //   // wx.switchTab({
      //   //   url: '/pages/tabs/center'
      //   // })
      //   if(getApp()){
      //     NT.showToast('登录中...')
      //     getApp().login()
      //   }
      //   return
      // }
      if (res.data.code === '000000') {
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
            header: upImgHeader,
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
        header: header,
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
  // 上传图片
  userUploadImage(filePath) {
    debugger
    const url = config.env[config.curEnv].baseUrl + `/imageUp/1.0/`
    const formData = {}
    return new Promise(resolve => {
      wx.uploadFile({
        url: url,
        header: upImgHeader,
        filePath: filePath,
        formData: formData,
        name: 'file',
        success: res => {
          console.log('上传成功')
          console.log('res')
          const data = JSON.parse(res.data)
          resolve(data)
        },
        fail: err => {
          console.log(err)
          NT.showModal(err)
        }
      })
    })
  },
  // 登录
  login() {
    return new Promise((resolve, reject) => {
      wx.login({
        success(res) {
          if (res.code) {
            const query = { code: res.code }
            //发起网络请求
            // execute(
            //   `/user/user/wxMiniProgramLogin`,
            //   'POST',
            //   query,
            //   resolve,
            //   reject
            // )
            execute(`/usRegist/1.0/`, 'POST', query, resolve, reject)
          } else {
            reject('登录失败！')
          }
        }
      })
      // return new Promise((resolve, reject) => {
      //   execute(`/usRegist/1.0/`, 'POST', query, resolve, reject)
      // })
    })
  },
  // 登录
  usLogin(query) {
    return new Promise((resolve, reject) => {
      execute(`/usLoginForPhone/1.0/`, 'POST', query, resolve, reject)
    })
  },
  // 注册
  register(query) {
    // return new Promise((resolve, reject) => {
    //   execute(`/user/user/wxRegistered`, 'POST', query, resolve, reject)
    // })
    return new Promise((resolve, reject) => {
      execute(`/usRegist/1.0/`, 'POST', query, resolve, reject)
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
  },
  // 领取体验
  saveDisCountOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/experience/experience/order/saveDisCountOrder`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增kol审核
  addKolAduit(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/user/kol/addKolAduit`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },



  // 商家搜索列表-按关键字分页搜索
  msSelectedMsByKeyWord(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsByKeyWord/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-按标签类别获取列表
  msSelectedMsByLabel(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsByLabel/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 商家详情
  msSelectedMsDetailsByMsId(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsDetailsByMsId/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 查询当前优惠券信息
  mkSelectDiscountsCardById(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/mkSelectDiscountsCardById/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取kol用户信息
  getKolBaseInfo(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getKolBaseInfo/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 添加kol用户信息
  usKolOtherInfo(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usKolOtherInfo/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户标签关联信息
  usInsertLabel(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertLabel/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户身份证信息
  usInsertIdentity(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertIdentity/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户银行卡信息
  usInsertCard(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertCard/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-首页
  msSelectedMsListHome(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsListHome/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-详情-猜你喜欢
  msSelectedMsListGuessYouLike(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsListGuessYouLike/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 精选商家-详情-相关视频
  msSelectedMsVideoByMsId(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectedMsVideoByMsId/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取商家标签类别列表
  msSelectMsLabelList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/msSelectMsLabelList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取系统标签
  sysLabelInfo(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/sysLabelInfo/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 新增用户标签
  usInsertLabel(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertLabel/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取认证KOL信息列表
  usIsCertificationKol(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usIsCertificationKol/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 关注用户
  usInsertFocus(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/usInsertFocus/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取用户关注列表
  getFocusList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getFocusList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 获取用户的粉丝列表
  getFansList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getFansList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 领取优惠卷
  poInsertDiscountOrder(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poInsertDiscountOrder/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 查询所有优惠卷
  poSelectDiscountList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/poSelectDiscountList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 微信支付
  wxPay(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/wxPay/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 首页搜索——用户昵称模糊搜索
  getFansList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/getFansList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 我的钱包界面
  atsSelect(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/atsSelect/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  },
  // 钱包流水
  atsSelectByList(query) {
    return new Promise((resolve, reject) => {
      execute(
        `/atsSelectByList/1.0/`,
        'POST',
        query,
        resolve,
        reject
      )
    })
  }
  /*** file-end ***/
}
