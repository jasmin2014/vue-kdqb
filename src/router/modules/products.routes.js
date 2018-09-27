export default {
  path: "products",
  name: "ProManage",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "ProductsWaysPage" },
  children: [
    {
      path: "ways",
      name: "ProductsWaysPage",
      component: () => import("@/pages/products/ways.vue"),
      meta: {
        title: "渠道列表",
        auth: false,
        show: true
      }
    },
    {
      path: "addway",
      name: "ProductAddWayPage",
      component: () => import("@/pages/products/addWay.vue"),
      meta: {
        title: "添加渠道",
        auth: false,
        show: false
      }
    },
    {
      path: "editway/:id",
      name: "ProductEditWayPage",
      component: () => import("@/pages/products/addWay.vue"),
      meta: {
        title: "编辑渠道",
        auth: false,
        show: false
      }
    },
    {
      path: "rules",
      name: "ProductsRules",
      component: () => import("@/pages/products/rules.vue"),
      meta: {
        title: "产品规则",
        auth: false,
        show: true
      }
    },
    {
      path: "editrule/:id",
      name: "ProductsEditRules",
      component: () => import("@/pages/products/editRule.vue"),
      meta: {
        title: "编辑产品规则",
        auth: false,
        show: false
      }
    },
    {
      path: "lookrule/:id",
      name: "ProductsLookRules",
      component: () => import("@/pages/products/editRule.vue"),
      meta: {
        title: "查看产品规则",
        auth: false,
        show: false
      }
    },
    {
      path: "userlevel",
      name: "ProductsUsersLevelPage",
      component: () => import("@/pages/products/userLevel.vue"),
      meta: {
        title: "用户等级列表",
        auth: false,
        show: true
      }
    },
    {
      path: "auth",
      name: "ProductsAuthPage",
      component: () => import("@/pages/products/auth.vue"),
      meta: {
        title: "认证模型管理",
        auth: false,
        show: true
      }
    },
    {
      path: "addauth",
      name: "ProductsAuthAddPage",
      component: () => import("@/pages/products/editAuth.vue"),
      meta: {
        title: "添加认证模型",
        auth: false,
        show: false
      }
    },
    {
      path: "editauth/:id",
      name: "ProductsAuthEditPage",
      component: () => import("@/pages/products/editAuth.vue"),
      meta: {
        title: "编辑认证模型",
        auth: false,
        show: false
      }
    },
    {
      path: "lookauth/:id",
      name: "ProductsAuthLookPage",
      component: () => import("@/pages/products/editAuth.vue"),
      meta: {
        title: "查看认证模型",
        auth: false,
        show: false
      }
    }
  ],
  meta: {
    title: "产品管理",
    auth: false,
    show: true
  }
};
