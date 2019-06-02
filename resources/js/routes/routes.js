import VueRouter from 'vue-router';
import login from '../pages/login';
import dashboard from '../pages/dashboard';
import location_detail from '../pages/location_detail';
import locations_overview from '../pages/locations_overview';


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
    {
        path: '/location',
        component: location_detail,
        meta: {
            title: "Quiklease - location",
            metaTags: [
                { name: "description", content: "location" },
                { property: "og:description", content: "location" }
            ]
        }
    },
    {
        path: '/locations',
        component: locations_overview,
        meta: {
            title: "Quiklease - locations",
            metaTags: [
                { name: "description", content: "locations" },
                { property: "og:description", content: "locations" }
            ]
        }
    },
];

const router = new VueRouter({
   routes,
   // mode: 'history'
});

export default router;