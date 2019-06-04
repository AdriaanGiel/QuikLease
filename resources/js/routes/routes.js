import VueRouter from 'vue-router';
import login from '../pages/temp_login';
import dashboard from '../pages/dashboard';


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
    {
        path: '/dashboard',
        component: dashboard,
        meta: {
            title: "Quiklease - dashboard",
            metaTags: [
                { name: "description", content: "dashboard" },
                { property: "og:description", content: "dashboard" }
            ]
        }
    },
];

const router = new VueRouter({
   routes,
   // mode: 'history'
});

export default router;