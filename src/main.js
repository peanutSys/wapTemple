import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import axios from 'axios';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

import 'element-ui/lib/theme-chalk/index.css';  // 默认主题
import 'babel-polyfill';//解决ie9和一些低版本的高级浏览器对es6新语法并不支持的问题

Vue.prototype.$bus = new Vue()

/*================配置性========================*/

Vue.prototype.$axios = axios

Vue.use(ElementUI)
//设置cookie,增加到vue实例方便全局调用
Vue.prototype.setCookie = (c_name, value, expiredays = 1000 * 60 * 60 * 24 * 1) => {
    
  var exdate = new Date();　　　　
  exdate.setDate(exdate.getDate() + expiredays);　　　　
  document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString())+";path=/";
}
//获取cookie、
Vue.prototype.getCookie = (name) => {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if (arr = document.cookie.match(reg))
	    return (arr[2]);
	else
	    return null;
}
//删除cookie
Vue.prototype.delCookie =(name) => {
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = Vue.prototype.getCookie(name);
    if (cval != null)
      document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString()+";path=/";
}

//获取图片base64
Vue.prototype.getImageBase64 = ( url,cb) =>{
  let self = this ,
  getb64 = (img) =>{
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png"); 
      return dataURL;
  },
  done64 = (src ) => {
      var image = new Image();
      image.src = src + '?v=' + Math.random(); // 处理缓存
      image.crossOrigin = "*";  // 支持跨域图片
      image.onload = function(){
          cb && cb( getb64(image));
      }
  }
  done64( url,cb)
}

/*================功能性========================*/
//配置ajax全局
$.ajaxSetup({timeout:30000})
//获取手指标识符
Vue.prototype.$fingerprint = FingerprintJS


new Vue({
	router,
	render: h => h(App),
	created() {
        let self = this;
    }
}).$mount('#app');







