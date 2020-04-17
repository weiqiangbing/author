import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import loading from './assets/js/loading'
import utily from './lib/utils/utily'
import i18n from './lib/utils/i18n'

import { Lazyload } from 'vant';
Vue.use(Lazyload, {
  lazyComponent: true
});

Vue.use(loading)
// import  VConsole  from  'vconsole';
// let vConsole = new VConsole();

import './assets/js/flexible'
import './assets/css/main.less'

Vue.config.productionTip = false

import axios from './lib/axios'

Vue.prototype.$axios = axios
Vue.prototype.$store = store

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

if(process.env.NODE_ENV == 'development'){
  import("./assets/css/thems/legend.less")
}else{
  utily.waitLoad(()=>{
    let appObj = utily.schemeObj()
    console.log("./assets/css/thems/"+appObj.themName+".less");
    
    import("./assets/css/thems/"+appObj.themName+".less")
    // if(parseInt(window.InteractorProxy.version) < 7){
    //     store.commit('showVersion',true)
    // }
  })
}


