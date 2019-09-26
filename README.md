# 项目结构

### component 项目公共组件
    + empty -- 列表空白展示组件
    + searchbar -- 列表搜索组件
    + skeleton -- 数据加载骨架屏组件

### data Api请求相关

### dist 外部引用插件
    + weui -- 类微信ui组件框架

### images 图片资源

### pages 页面根目录
    + login 登录相关
    + tabs 导航页面
    + views 分包加载页面(device相关因特殊原因排除，根据相关tabs触发分包加载)

### utils 工具类

# 开发注意事项
### 1.分包加载页面样式wxss需要手动引用根目录app.wxss（切记）