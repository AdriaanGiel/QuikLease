/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');

import router from './routes/routes';
import * as VueGoogleMaps from "vue2-google-maps";

Vue.use(VueGoogleMaps, {
    load: {
        key: "AIzaSyB3TJYJHakiZKnM2W0q1JuqFlHzel7sKis",
        libraries: "places" // necessary for places input
    }
});

const app = new Vue({
    el: '#app',
    router: router
});

$.material.init()