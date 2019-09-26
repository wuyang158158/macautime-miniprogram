/**
 * 弹框提示
 */
const showModal = msg => {
    hideToast();
    wx.showModal({
        title: '提示',
        showCancel: false,
        confirmColor: '#00A653',
        content: msg || '处理异常',
        success: function(res) {
            if (res.confirm) {
                console.log('用户点击确定')
            }
        },
        fail: function(err) {
            console.log(err)
        }
    })
};
/**
 * 弹框提示 带确认和支付
 */
const showModalPromise = msg => {
    return new Promise((resolve, reject) => {
        hideToast();
        wx.showModal({
            title: '提示',
            confirmColor: '#00A653',
            content: msg || '处理异常',
            success: function(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                    resolve()
                } else if (res.cancel) {
                    console.log('用户点击取消')
                    reject()
                }
            },
            fail: function(err) {
                console.log(err)
            }
        })
    })
}
/**
 * loadding
 */
const showToast = msg => {
    wx.showNavigationBarLoading();
    if (wx.showLoading) {
        wx.showLoading({
            title: msg || '处理中',
            mask: true
        })
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.showToast({
            title: msg || '处理中',
            mask: true,
            icon: 'loading',
            mask: true,
            duration: 10000
        });
    }
};
/*
 *title:提示标题
 */
const toastFn = (msg,time) => {
    wx.hideLoading();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading();
    wx.showToast({
        title: msg || '提示',
        mask: true,
        icon: 'success',
        duration: time ? time : 2000
    });
};
/**
 * loadding
 */
const hideToast = () => {
    if (wx.hideLoading) {
        wx.hideLoading();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
    } else {
        // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
        wx.hideToast();
        wx.stopPullDownRefresh();
        wx.hideNavigationBarLoading();
    }
};
/**
 * 无图标提示窗口
 */
const showToastNone = (msg,time) => {
    wx.showToast({
        title: msg,
        icon: 'none',
        duration: time ? time : 2000
    })  
}

module.exports = {
    showModal: showModal,
    showModalPromise: showModalPromise,
    showToast: showToast,
    hideToast: hideToast,
    toastFn: toastFn,
    showToastNone: showToastNone
};