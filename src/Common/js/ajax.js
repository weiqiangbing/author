/** @format */

import $fetch from '@system.fetch'
import storage from '@system.storage'
import $utils from './utils/index'
const prompt = require('@system.prompt')
// const baseUrl = 'http://rest.litong.cn.moqing.com' // 测试
const baseUrl = 'http://cn-wyqrest.damowang.com/' // demo
// const baseUrl = 'https://wyqrest.meixiangdao.com'

// let token = ''
Promise.prototype.finally = function(callback) {
  const P = this.constructor
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason =>
      P.resolve(callback()).then(() => {
        throw reason
      })
  )
}

function getToken(){
  return new Promise((reslove, reject)=>{
    storage.get({
      key: 'token',
      success: function(data){
        // console.log('token', data)
        reslove(data)
      },
      fail: function(data){
        reject(data)
      }
    })    
  })  
}

function getUid(){
  return new Promise((reslove, reject)=>{
    storage.get({
      key: 'quick_user_id',
      success: function(data){
        reslove(data)
      },
      fail: function(data){
        reject(data)
      }
    })    
  })  
}

async function requestHandle(params) {
  let token = await getToken()
  let uid = await getUid()  
  return new Promise((resolve, reject) => {
    $fetch
      .fetch({
        url: baseUrl + params.url,
        method: params.method,
        data: params.data,
        responseType: 'text',
        header: {
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + token,
          "Device-uuid": uid,
          "X-App-Version": '1.0.0'
        },
      })
      .then(response => {
        console.log('response', response)
        const result = response.data ? response.data : response
        // const result = response.data ? JSON.parse(response.data) : JSON.parse(response)
        // $utils.setCurrentTime(result.headers && result.headers.Date)

        /* @desc: 可跟具体不同业务接口数据，返回你所需要的部分，使得使用尽可能便捷 */
        // console.log(result)
        let content = null
        if(result.data){
          content = JSON.parse(result.data)
        }else{
          content = JSON.parse(result)
        }
        resolve(content)
        // content ? resolve(content) : resolve(content)
      })
      .catch((error, code) => {
        console.log('error', error)
        console.log(`request fail, code = ${code}`)
        reject(error)
      })
      .finally((res) => {
        console.log(`request @${params.url} has been completed.`)
        resolve()
      })      
  })
}

export default {
  post: function(url, params) {
    return requestHandle({
      method: 'post',
      url: url,
      data: params
    })
  },
  get: function(url, params) {
    return requestHandle({
      method: 'get',
      url: $utils.queryString(url, params)
    })
  }
}