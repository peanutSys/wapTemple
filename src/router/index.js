import Vue from 'vue';
import Router from 'vue-router';

import MobileTemplate from '../views/template/mobileTemplate'; 

Vue.use(Router);
export default new Router({
    // mode: 'history',
    routes: [
        {
            path: '/',
            redirect: '/mt' //重定向
        },
        {
            path: '/mt',
            name: 'mobileTemplate',
            component: MobileTemplate
        },
    ]
})


