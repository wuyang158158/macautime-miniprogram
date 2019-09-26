// components/searchbar/searchbar.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        propType: String,
        propText: String,
        propMt: Number
    },
    /**
     * 组件的初始数据
     */
    data: {

    },
    lifetimes: {
        // 生命周期函数，组件生命周期函数-在组件实例进入页面节点树时执行)
        attached: function () {
            console.log(this.data.propType)
         },
    },
    /**
     * 组件的方法列表
     */
    methods: {
        
    }
});