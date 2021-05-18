//存储工具类 只支持 object array number string
import storage from '@system.storage'

module.exports = {
  //获取Storage
  getStorageSync(key) {
    return new Promise(resolve => {
      storage.get({
        key: key,
        success: function (data) {
          if (data == '') {
            data = '{"type":"string","value":""}'
          }
          let obj = JSON.parse(data);
          let res;
          if (obj.type == 'string') {
            res = obj.value
          } else {
            res = JSON.parse(obj.value)
          }
          resolve(res)
        },
        fail: function (data, code) {
          console.log(`handling fail, code = ${code}`)
          resolve('')
        }
      })
    })
  },
  //设置Storage
  setStorageSync(key, val) {
    return new Promise(resolve => {

      function test(o) {
        var s = Object.prototype.toString.call(o);
        return s.match(/\[object (.*?)\]/)[1].toLowerCase();
      }

      let type = test(val);

      //可以存储的类型
      let enableSaveType = {
        object: 1, array: 1, number: 1, string: 1
      }

      if (!enableSaveType[type]){
        resolve('err');
        console.log('不可被存储的类型')
        return;
      }

      let value;
      if (type != 'string') {
        value = JSON.stringify(val);
      } else {
        value = val
      }
      let obj = { type, value }


      storage.set({
        key: key,
        value: JSON.stringify(obj),
        success: function () {
          resolve('suc')
        },
        fail: function (data, code) {
          console.log(`handling fail, code = ${code}`)
          resolve('err')
        }
      })
    })
  }
}
