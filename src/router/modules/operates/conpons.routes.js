export default {
  path: "conpons",
  name: "Conpons",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "OperateCouponsPage" },
  children: [
    {
      path: "list",
      name: "OperateCouponsPage",
      component: () => import("@/pages/operate/conpons/list.vue"),
      meta: {
        title: "卡券列表",
        auth: false,
        show: true
      }
    },
    {
      path: "addconpon",
      name: "OperateAddCouponPage",
      component: () => import("@/pages/operate/conpons/add.vue"),
      meta: {
        title: "新增卡券",
        auth: false,
        show: false
      }
    },
    {
      path: "conpondetail/:id",
      name: "OperateCouponDetailPage",
      component: () => import("@/pages/operate/conpons/detail.vue"),
      meta: {
        title: "查看卡券",
        auth: false,
        show: false
      }
    },
    {
      path: "users",
      name: "OperateCouponUsersPage",
      component: () => import("@/pages/operate/conpons/users.vue"),
      meta: {
        title: "卡券发放查询",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "卡券管理",
    auth: false,
    show: true
  }
};
