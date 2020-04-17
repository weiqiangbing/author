import formatJson from './formatJson'
import config from '../config'
export default{
    waitLoad(callback){
        var terval = setInterval(() => {
            if(window.InteractorProxy && window.InteractorProxy.app){
                clearInterval(terval)
                callback()        
            }
        }, 50);
    },
    // 获取app下的scheme
    schemeObj(){
        let scheme = window.InteractorProxy.app.scheme
        if(scheme && scheme.indexOf(':') != -1){
            scheme = scheme.split(':')[0]
        }
        let appObj = formatJson.formatAppInfo('appName', scheme)
        return appObj
    },
    // 防抖
    debounce(fn,wait){
        var timer = null;
        return function(){
            if(timer !== null){
                clearTimeout(timer);
            }
            timer = setTimeout(fn,wait);
        }
    },
    // 闭包防抖
    debounces(fn, wait) {    
        let timer = null;
        return function() {
        const context = this;
        const args=arguments;
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(context,args);
        }, wait);
        }
    },
    // 将行内的px转化为rem
    linePxToRem(num){
        if(num && typeof(num)=='number'){
            return (num / config.pxRemUnit)+'rem'
        }else{
            if(num && typeof(num)=='string' && num.indexOf('px') != -1){
                return (Number(num.split('px')[0]) / config.pxRemUnit)+'rem'
            }else{
                return '0rem'
            }
        }
    },
    

}