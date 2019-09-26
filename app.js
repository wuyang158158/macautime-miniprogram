//app.js
import utils from "/utils/util.js";
import apiCfg from "/data/api_config.js";
import api from "/data/api.js"

const baseUrl = apiCfg.env[apiCfg.curEnv].baseUrl;

App({
  /**
   * 生命周期-初始化
   */
  onLaunch(options) {
    // 打开调试
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
    // 获取设备信息
    wx.getSystemInfo({
      success: res=>{
        // console.log('手机信息res'+res.model)
        let modelmes = res.model;
        if (modelmes.search('iPhone X') != -1) {
          this.globalData.isIphoneX = true;
        }
      }
    })
    // 获取定位权限
    // wx.getSetting({
    //   success(res) {
    //     if (!res.authSetting['scope.userLocation']) {
    //       wx.authorize({
    //         scope: 'scope.userLocation',
    //         success (res) {
    //           // 用户已经同意 后续调用 wx.getLocation, 接口不会弹窗询问
    //           // 必须是在用户已经授权的情况下调用
    //           wx.getLocation()
    //         }
    //       })
    //     }
    //   }
    // })
    //获取登录信息
    // this.login()
  },
  login() {
    return new Promise((resolve) => {
      // 获取用户信息
      api.login()
      .then((res) => {
        wx.setStorage({
          key:"userInfo",
          data:res
        })
        // console.log(wx.getStorageSync("userInfo"))
        resolve(res)
      })
      .catch((err)=>{
        resolve(null)
      })
    })
    
  },
  globalData: {
    isIphoneX: false,
    ticket: false
  }
});