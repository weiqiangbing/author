import Vue from 'vue'
import VueI18n from 'vue-i18n'
import {chooseZh} from '../../assets/js/chiness'
import utily from '../utils/utily'

Vue.use(VueI18n)

class CustomFormatter {
    // constructor (options) {
    //   // ...
    // }
    interpolate (message) {
        let result = message
        // console.log(i18n.locale);
        if(i18n.locale == 'zh'){
            // console.log('message',message);
            result = chooseZh(message, 'n')
            // console.log('result',result);
        }
        return result
    }
}

const i18n = new VueI18n({ 
    locale: 'zh', // 定义默认语言为中文 
    formatter: new CustomFormatter(),
    messages: {   
        'zh': require('@/assets/json/zh.json'),   
        'en': require('@/assets/json/en.json') 
    }
});

utily.waitLoad(()=>{
    let appObj = utily.schemeObj()
    i18n.locale = appObj.land
})
    

export default i18n