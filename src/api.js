import fetch from '@system.fetch'

// fetch.fetch({
//   url: 'https://wyqwxapp.meixiangdao.com/ajax_main/index?tn=null',
//   success: function(response) {
//     _this.home_data = response.data
//     console.log(`the status code of the response: ${response}`)
//     console.log(`the status code of the response: ${response.code}`)
//     console.log(`the data of the response: ${response.data}`)
//     console.log(
//       `the headers of the response: ${JSON.stringify(response.headers)}`
//     )
//   },
//   fail: function(data, code) {
//     console.log(`handling fail, errMsg = ${data}`)
//     console.log(`handling fail, errCode = ${code}`)
//   }
// })
// let allUrl = ''
let baseUrl = 'https://wyqwxapp.meixiangdao.com/'
/**
 * 将对象转成 a=1&b=2的形式
 * @param obj 对象
 */
function obj2String(obj, arr = []) {
  for (var key in obj) {
    arr.push(key + '=' + obj[key]);
  }
  // console.log(arr.join('&'))
  return arr.join('&');
}

/**
 * 真正的请求
 * @param url 请求地址
 * @param options 请求参数
 * @param method 请求方式
 */
function commonFetcdh(url, options, method = 'GET') {
  var searchStr = obj2String(options)
  let initObj = {}
  if (method === 'GET') { // 如果是GET请求，拼接url
    url += '?' + searchStr
    initObj = {
      method: method,
      // credentials: 'include'
    }
  } else {
    initObj = {
      method: method,
      // credentials: 'include',
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
      body: searchStr
    }
  }
  // console.log('url', url)
  // var allUrl = ''
  // allUrl = baseUrl + url
  // console.log('allUrl', allUrl)
  const promise = new Promise((resolve, reject) => {
    fetch.fetch({url, initObj, 
      success: function(res) {
        console.log(`the status code of the response: ${res.code}`)
        resolve(JSON.parse(res.data)
        )
      },
      fail: function(data, code) {
        console.log(`handling fail, errMsg = ${data}`)
        reject(data)
      }
    })
  })
  return promise
}

/**
 * GET请求
 * @param url 请求地址
 * @param options 请求参数
 */
export function fetchGet(url, options) {
  return commonFetcdh(url, options, 'GET')
}

/**
 * POST请求
 * @param url 请求地址
 * @param options 请求参数
 */
export function fetchPOST(url, options) {
  return commonFetcdh(url, options, 'POST')
}
// GET('https://www.baidu.com/search/error.html', {a:1,b:2})
// POST('https://www.baidu.com/search/error.html', {a:1,b:2})