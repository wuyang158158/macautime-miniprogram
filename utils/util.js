/**
 * 格式化时间
 */
const formatTime = date => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':');
};

/**
 * 格式化数字
 */
const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

/** 
 * 时间戳转化为年 月 日 时 分 秒 
 * number: 传入时间戳 
 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
 */
const formatTimeTwo = (time, format) => {
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (isNaN(Number(time))) {
        date = new Date(time)
      } else {
        if (('' + time).length === 10) time = parseInt(time) * 1000
        date = new Date(time)
      }
    }

    var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    var returnArr = [];
    returnArr.push(date.getFullYear());
    returnArr.push(formatNumber(date.getMonth() + 1));
    returnArr.push(formatNumber(date.getDate()));

    returnArr.push(formatNumber(date.getHours()));
    returnArr.push(formatNumber(date.getMinutes()));
    returnArr.push(formatNumber(date.getSeconds()));

    for (var i in returnArr) {
      format = format.replace(formateArr[i], returnArr[i]);
    }
    return format;
  };
  /**
   * 根据起止时间计算有效期 日期格式为 YYYY-MM-dd  
   */
  const daysBetween = (DateOne, DateTwo) => {
      var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('/'));
      var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('/') + 1);
      var OneYear = DateOne.substring(0, DateOne.indexOf('/'));

      var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('/'));
      var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('/') + 1);
      var TwoYear = DateTwo.substring(0, DateTwo.indexOf('/'));

      var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
      return Math.abs(cha);
    };

    /**
     * 判断字符串是否为空
     */
    const isNull = str => {
      if (str) {
        str = str.toString().replace(/\s/g, "")
        return str === '' || str === undefined || str === null || str === "undefined";
      } else {
        return true
      }
    };
/**
 * 会员中心领取劵合并数组
 */
const packedArray = array => {
  if (array.length) {
    let newArray = []
    let obj = {}
    array.forEach((v, i) => {
      Number(i) % 2 === 0 ? Number(i) + 1 === array.length ? newArray.push(objPush(v)) : obj = v : newArray.push(objPush(v, obj))
    });
    return newArray;
  } else {
    return true
  }
};
const objPush = (v, array) => {
  let obj = {
    array: []
  };
  array ? obj.array.push(array) : '';
  obj.array.push(v);
  return obj;
}
//折扣计算
const discountPrice = (price, discount) => {
  let newPrice = price * (Number(discount) / 100)
  return newPrice.toFixed(2)
}
// 手机号中间四位显示****
const phoneReplace = (phone) => {
  var reg = /^(\d{3})\d*(\d{4})$/;
  var str = phone.replace(reg,'$1****$2');
  return str;
}


module.exports = {
  formatTime: formatTime,
  formatNumber: formatNumber,
  formatTimeTwo: formatTimeTwo,
  daysBetween: daysBetween,
  isNull: isNull,
  packedArray: packedArray,
  discountPrice: discountPrice,
  phoneReplace: phoneReplace
};