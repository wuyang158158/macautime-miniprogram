// components/kolList.js
import NT from "../../utils/native.js"
import api from "../../data/api.js"
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    kolList: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    tapUsInsertFocus(e) {
      NT.showToast('处理中...')
      const fAccountId = e.currentTarget.dataset.faccountid
      api.usInsertFocus({fAccountId:fAccountId})
      .then(res=>{
        console.log(res)
        NT.toastFn('关注成功！')
        const kolList = this.data.kolList
        kolList.map(item=>{
          if(item.id === fAccountId){
            item.isfocus = true
          }
        })
        this.setData({
          kolList: kolList
        })
      })
      .catch(err=>{
        NT.showModal(err.message||'请求失败！')
      })
    }
  }
})
