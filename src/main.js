// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import out from 'save-svg-as-png/lib/saveSvgAsPng.js'

Vue.config.productionTip = false
Vue.prototype.$out = out

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})