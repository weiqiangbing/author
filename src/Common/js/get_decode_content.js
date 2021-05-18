/**
* 接口返回书籍内容解密，解压处理
* 2020/8/20
* xiaobai
*/
let BASE_64_STANDARD = [65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47, 61];
let LOOK_UP_TABLE =  [81, 87, 105, 74, 111, 115, 113, 66, 103, 114, 47, 53, 82, 72, 77, 108, 54, 88, 102, 43, 76, 67, 119, 99, 121, 50, 117, 73, 84, 98, 104, 97, 78, 65, 120, 70, 57, 49, 122, 101, 75, 85, 106, 61, 89, 118, 55, 107, 86, 116, 83, 51, 48, 71, 110, 112, 52, 69, 90, 56, 100, 80, 109, 79, 68];
import { Base64 } from './base64.js'
import './zlib_and_gzip.min.js'

export const getDecodeContent = {
    getConten(bookId, chapterId, content) {
        // let ByteArray = []
        let bias = (bookId + chapterId) % 65 + 1
        let length = BASE_64_STANDARD.length
        let table = {}
        let result = []
        let win = length / bias
        let splitPosition = []
        for(let i = 0; i < win; i++){
            splitPosition[i] = i * bias
        }
        let splitIndex = splitPosition.length - 1
        let end = length
        let resultIndex = 0
        while (splitIndex >= 0) {
            let start = splitPosition[splitIndex]
            let index = 0
            while (start + index < end) {
            table[LOOK_UP_TABLE[start + index]] = BASE_64_STANDARD[resultIndex]
            index++
            resultIndex++
            }
            end = start
            splitIndex--
        }
        let cryptStringArr = this.string2Bin(content)
        cryptStringArr.forEach((item, index) => {
            result[index] = table[item] ? table[item] : 0
        });
        // 解压
        let con = this.byteToString(result)
        var bytes = Base64.decodeToBytes(con);
        var gunzip = new Zlib.Gunzip(bytes);
        var plain = gunzip.decompress();
        // var asciistring = new TextDecoder("utf-8").decode(plain);
        var asciistring = decodeURIComponent(escape(String.fromCharCode.apply(null, (plain))));
        return asciistring
    },
    string2Bin: function(str) {
        var result = [];
        for (var i = 0; i < str.length; i++) {
            result.push(str.charCodeAt(i));
        }        
        return result;
    },
    byteToString: function(arr) {
        if(typeof arr === 'string') {
          return arr;
        }
        var str = '',
          _arr = arr;
        for(var i = 0; i < _arr.length; i++) {
          var one = _arr[i].toString(2),
            v = one.match(/^1+?(?=0)/);
          if(v && one.length == 8) {
            var bytesLength = v[0].length;
            var store = _arr[i].toString(2).slice(7 - bytesLength);
            for(var st = 1; st < bytesLength; st++) {
              store += _arr[st + i].toString(2).slice(2);
            }
            str += String.fromCharCode(parseInt(store, 2));
            i += bytesLength - 1;
          } else {
            str += String.fromCharCode(_arr[i]);
          }
        }
        return str;
    }   
};
 