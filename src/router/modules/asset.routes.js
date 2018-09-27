export default {
  path: "assets",
  name: "Assets",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "AssetsPoolPage" },
  children: [
    {
      path: "pool",
      name: "AssetsPoolPage",
      component: () => import("@/pages/assets/pool.vue"),
      meta: {
        title: "资产池",
        auth: false,
        show: true
      }
    },
    {
      path: "manage",
      name: "AssetsManagePage",
      component: () => import("@/pages/assets/manage.vue"),
      meta: {
        title: "资产规则管理",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "资产管理",
    auth: false,
    show: true
  }
};
