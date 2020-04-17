import app from './app'
import Vue from 'vue'
import loading from '@/assets/js/loading'
import utily from '@/lib/utils/utily'
import i18n from '@/lib/utils/i18n'

import { Lazyload } from 'vant';
Vue.use(Lazyload, {
  lazyComponent: true
});

Vue.use(loading)
// import  VConsole  from  'vconsole';
// let vConsole = new VConsole();

import '@/assets/js/flexible'
import '@/assets/css/main.less'

Vue.config.productionTip = false

new Vue({
  // store,
  i18n,
  render: h => h(app)
}).$mount('#app')

if(process.env.NODE_ENV == 'development'){
  import("@/assets/css/thems/legend.less")
}else{
  utily.waitLoad(()=>{
    let appObj = utily.schemeObj()    
    import("@/assets/css/thems/"+appObj.themName+".less")
  })
}