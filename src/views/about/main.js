import app from './app'

Vue.config.productionTip = false

new Vue({
  render: h => h(app)
}).$mount('#app')