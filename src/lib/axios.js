import Vue from 'vue'
import axios from 'axios'
import storage from './utils/localstorage'
import config from './config'
import { Toast } from 'vant'
// import router from '../router'
import {params} from './utils/variable'
import {goTo} from '@/lib/utils/native'
// import loading from '../assets/js/loading'
// import qs from 'qs'
const origin = location.origin
const Axios = axios.create({
    baseURL: origin+'/api',
    responseType:'json',
    timeout: config.requestTimeOut, 
    crossDomain: true,
    withCredentials: false,
    headers:{
      "Content-Type": "application/json",
      "authorization":'',
    }
})

Axios.interceptors.request.use(
    config => {
        if(config.method == 'get') {
          // 这里获取lang
          if(params.lang && config.url){
            if(config.url.indexOf('?') == -1){
              config.url += '?lang='+params.lang+'&roundtime='+new Date().getTime()
            }else{
              config.url += '&lang='+params.lang+'&roundtime='+new Date().getTime()
            }
          }
          // console.log(config.url);
        }
        // 判断是否存在token，如果存在的话，则每个http header都加上token
        if(process.env.NODE_ENV == 'development'){
            let devLoginInfo = storage.get('devLoginInfo')            
            if(devLoginInfo && devLoginInfo.token){
              //添加请求头
              config.headers = Object.assign(config.headers,{
                "authorization": 'Bearer '+devLoginInfo.token,
                "Device-Uuid": "6f03a8dff7d9f54a7d05f0a420fe8bbfe8f19448",
                // "User-Agent": "Android",
                "X-App-Version": "1.6.0"
                // 'User-Agent': 'ylsyapp/ios iPhone Mobile',
              })
            }else{
              // router.push('/login')
              goTo('login.html')
            }
          // }
        }else{
          console.log('------------------axios.js文件-----------------------');
          // console.log('(window.InteractorProxy.getUserInfo()',window.InteractorProxy.getUserInfo());
          console.log('(window.InteractorProxy.app',window.InteractorProxy.app);
          let proUserInfo = window.InteractorProxy.getUserInfo()
          let appInfo = window.InteractorProxy.app
          console.log('获取app的userInfo', proUserInfo);
          if(proUserInfo && proUserInfo.id){
            //添加请求头
            let scheme = appInfo.scheme
            if(scheme && scheme.indexOf(':') != -1){
              scheme = scheme.split(":")[0]
            }

            let platform = appInfo.platform
            if(platform && platform.toLowerCase() !='android'){
              platform = 'ios iPhone Mobile'
            }
            config.headers = Object.assign(config.headers,{
              "authorization": 'Bearer '+proUserInfo.token,
              "Device-Uuid": proUserInfo.uuid,
              "x-app-version": appInfo.version,
              "User-Agent": scheme+'/'+platform
            })
            // console.log("config.headers", JSON.stringify(config.headers));
            
          }else{
            window.InteractorProxy.login()
          }
          
        }
        return config
    },
    err => {
      console.log('error00000', err);
        return Promise.reject(err)
    }
)

Axios.interceptors.response.use(
    response => {
      // 如果返回的状态码为200，说明接口请求成功，可以正常拿到数据
      if (response.status === 200) {
        return Promise.resolve(response);
      } else {
        new Vue().$loading.hide()
        return Promise.reject(response);
      }
    },

    // 服务器状态码不是2开头的的情况
    // 这里可以跟你们的后台开发人员协商好统一的错误状态码
    // 然后根据返回的状态码进行一些操作，例如登录过期提示，错误提示等等
    error => {
      console.log('error1111', error);
    
      // 判断请求超时
      if (error.message.indexOf('Network Error') !== -1) {
        Toast({
          message: 'request timeout',
          position: 'bottom'
        })
      }else if (!error.response) {
        Toast({
          message: 'Interface exception',
          position: 'bottom'
        })
      }else if (error.response.status) {
        if(error.response.data.code == 5002 || error.response.data.code == 5005){
          // Toast('登陆超时')
          if(process.env.NODE_ENV=='development'){
            // router.push('/login')
            goTo('login.html')
          }else{
            window.InteractorProxy.login()
          }
        }else{
          // Toast(error.response.data.desc)
          Toast({
            message: error.response.data.desc,
            position: 'bottom'
          })
        }
      }
      new Vue().$loading.hide()
      return Promise.reject(error)
    }
  );

export default Axios
