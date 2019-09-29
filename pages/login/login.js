// pages/login.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
import FormValidator from "../../utils/validator.js"

const app = getApp();
var home = false;
var acDetail = false;

const loginInputFields = [{
    "name": "username",
    "desc": "手机号码",
    "pattern": /^(([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+)|(1[0-9]{10})$/,
    "isNull": false,
    "placeholder": "请输入手机号码",
    "maxlength": 30
  },
  {
    "name": "password",
    "desc": "密码",
    "type": "password",
    "isNull": false,
    "placeholder": "请输入密码",
    "maxlength": 20
  }
]

Page({
  validator: new FormValidator(loginInputFields),

  /**
   * 页面的初始数据
   */
  data: {
    inputFields: loginInputFields,
    prompt: "",
    inputData: {},
    btn_clear_show: "",
    register: true, //用户是否注册手机号码
    registerForm: {
      wxUnionid: '',
      openid: ''
    },
    container: false, //内容
  },
  /**
   * 输入
   */
  onInputField(event) {
    let inputData = this.data.inputData;
    inputData[event.currentTarget.dataset.field] = event.detail.value;
    this.setData({
      inputData: inputData
    });
  },
  onInputFocus(event) {
    let name = event.currentTarget.dataset.field;
    this.setData({
      btn_clear_show: name
    });
  },
  onInputBlur(event) {
    this.setData({
      btn_clear_show: ""
    });
  },
  /**
   * 输入清除
   */
  onInputClear(event) {
    let inputData = this.data.inputData;
    if (event.currentTarget.dataset.field in inputData) {
      inputData[event.currentTarget.dataset.field] = "";
    }
    this.setData({
      inputData: inputData
    });
  },
  onLogin() {
    const that = this
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.userInfo" 这个 scope
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success (res) {
              // 用户已经同意 后续调用 wx.getUserInfo 接口不会弹窗询问
              // 必须是在用户已经授权的情况下调用
              wx.getUserInfo()
            },
            fail () { //用户拒绝授权 则提示用户去授权
              wx.openSetting({
                success (res) {
                  console.log(res.authSetting)
                  res.authSetting = {
                    "scope.userInfo": true,
                    "scope.userLocation": true
                  }
                }
              })
            }
          })
        }else{
          // 必须是在用户已经授权的情况下调用
          wx.getUserInfo({
            success: function(res) {
              console.log(res)
              var userInfo = res.userInfo
              var nickName = userInfo.nickName
              var avatarUrl = userInfo.avatarUrl
              var gender = userInfo.gender //性别 0：未知、1：男、2：女
              var province = userInfo.province
              var city = userInfo.city
              var country = userInfo.country
              wx.login({
                success (res) {
                  if (res.code) {
                    //发起网络请求
                    console.log(res.code)
                    api.login({code:res.code})
                    .then((res) => {
                      // debugger
                      wx.setStorage({
                        key:"userInfo",
                        data:res
                      })
                      wx.switchTab({
                        url: '/pages/tabs/index'
                      });
                    })
                    .catch((err)=>{
                      if(err.code==='10019'){ //用户未注册
                        that.setData({
                          register: true
                        })
                      }else{
                        NT.showModal(err.codeMsg||'登录失败！')
                      }
                    })
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })
            },
            fail : function(err) {
              console.log(err)
            }
          })
        }
      }
    })
    // wx.redirectTo({
    //   url: '../tabs/index'
    // });
    // wx.hideLoading()
    // api.login(loginData).then(() => {
    //   wx.switchTab({
    //     url: '../tabs/index'
    //   });
    // }, msg => {
    //   if (msg === undefined)
    //     msg = "登录失败"
    //   wx.hideLoading()
    //   wx.showToast({
    //     title: msg,
    //     icon: 'none'
    //   });
    // });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(query) {
    home = false
    if(JSON.stringify(query) === "{}"){
      NT.showToast('登录中...')
      app.login()
      .then(res=>{
        wx.switchTab({
          url: '/pages/tabs/index'
        })
      })
      
    }else if(query.shareType === 'acDetail'){ //分享详情
      wx.navigateTo({
        url: '/pages/views/ac-detail?id=' + query.id + '&title=' + query.title
      })
      // home = true
      acDetail = true
    }else{
      const optionsObj = {
        wxUnionid: query.unionid,
        openid: query.openid
      }
      this.data.registerForm = optionsObj
      this.setData({
        container: true,
        ticket: query.ticket
      })
    }
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    if(home){
      wx.switchTab({
        url: '/pages/tabs/index'
      })
    }
  },
  onHide: function() {
    if(acDetail){
      home = true
    }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onUnload: function() {
    if(acDetail){
      home = true
    }
  },
  onRegister(res) {
    var that = this;
    var encryptedData = res.detail.encryptedData
    var iv = res.detail.iv
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        var userInfo = res.userInfo
        var nickName = userInfo.nickName
        var avatarUrl = userInfo.avatarUrl
        var gender = userInfo.gender //性别 0：未知、1：男、2：女
        var province = userInfo.province
        var city = userInfo.city
        var country = userInfo.country
        var obj = {
          encryptedData: encryptedData,
          iv: iv,
          nickName: nickName,
          headUrl: avatarUrl,
          sex: gender === 2 ? '1' : '0',  //0-男 1-女"
          source: '1'  //1-微信小程序  2-微信公众号"
        }
        var registerForm = Object.assign({},that.data.registerForm, obj)
        api.register(registerForm)
        .then((res) => {
          // debugger
          wx.setStorage({
            key:"userInfo",
            data:res
          })
          NT.toastFn('登录成功！',1000)
          if(that.data.ticket){ //通知票劵页面需要刷新
            app.globalData.ticket = true
          }
          setTimeout(()=>{
            wx.navigateBack({
              delta: 1
            })
          },1000)
        })
        .catch((err)=>{
          console.log(err)
          NT.showModal(err.codeMsg||'登录失败！')
        })
      },
      fail : function(err) {
        console.log(err)
      }
    })
  },
  tapToAgreement() { //跳转到果核协议
    wx.navigateTo({
      url: '/pages/views/gh-agreement'
    })
  }
});