import Vue from 'vue';
import VueRouter from 'vue-router';
import * as uiv from 'uiv'
import Field from 'material-components-vue/dist/text-field';


window.Vue = Vue;
window.VueRouter = VueRouter;
window.axios = require('axios');

Vue.use(VueRouter);
Vue.use(uiv);

Vue.use(Field);
