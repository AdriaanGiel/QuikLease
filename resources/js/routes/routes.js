import VueRouter from 'vue-router';
import login from '../pages/temp_login';
import dashboard from '../pages/dashboard';
import location_detail from '../pages/location_detail';
import locations_overview from '../pages/locations_overview';
import maintenance_overview from '../pages/maintenance';
import collect from '../pages/collect';


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
    {
        path: '/maintenance',
        component: maintenance_overview,
        meta: {
            title: "Quiklease - maintenance",
            metaTags: [
                { name: "description", content: "maintenance" },
                { property: "og:description", content: "maintenance" }
            ]
        }
    },
    {
        path: '/collect',
        component: collect,
        meta: {
            title: "Quiklease - collect",
            metaTags: [
                { name: "description", content: "collect" },
                { property: "og:description", content: "collect" }
            ]
        }
    },
];

const router = new VueRouter({
   routes,
   // mode: 'history'
});

export default router;