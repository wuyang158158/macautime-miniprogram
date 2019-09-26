export default {
  "env": {
    "dev": {
      // "baseUrl": "https://192.168.31.185:8080",
      // "baseUrl": "https://192.168.31.130:8443",
      "baseUrl": "https://test.guoh.com.cn:8443"
    },
    "prod": {
      "baseUrl": "https://time.guoh.com.cn:8443"
    },
  },
  "curEnv": "dev",
  //接口请求返回码
  //TODO 了解当前后台系统所有返回code并添加进错误码枚举对象里面
  "messageCode": {
    "200": "请求成功！",
    "400": "服务请求失败！",
    "401": "当前登录已过期，请重新登录！",
    "403": "当前用户无权限请求该内容！",
    "404": "请求的资源不存在！",
    "500": "当前服务不可用！",
    "503": "当前服务不可用！"
  }
}