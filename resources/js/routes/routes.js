import VueRouter from 'vue-router';
import login from '../pages/login';

let routes = [
    {
        path: '/',
        component: login,
        meta: {
            title: "Quiklease - login",
            metaTags: [
                { name: "description", content: "De inlogpagina voor QuikLease" },
                { property: "og:description", content: "De inlogpagina voor QuikLease" }
            ]
        }
    },
];

const router = new VueRouter({
   routes,
   // mode: 'history'
});

export default router;