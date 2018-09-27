export default {
    path:"page",
    name:"Page",
    component: () => import("@/pages/components/public.vue"),
    redirect: { name: "PageManageIndex" },
    children:[ 
        {
            path: "index",
            name: "PageManageIndex",
            component: () => import("@/pages/operate/pageManage/index.vue"),
            meta: {
                title: "页面管理",
                auth: false,
                show: true
            }
        },
        {
            path: "appIndexManage",
            name: "AppIndexManage",
            component: () => import("@/pages/operate/pageManage/appIndexManage.vue"),
            meta: {
                title: "页面配置",
                auth: false,
                show: false
            }
        }
    ],
    meta:{
        title: "页面配置",
        auth: false,
        show: true
    }
}