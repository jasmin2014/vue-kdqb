export default {
  path: "shop",
  name: "Shop",
  component: () => import("@/pages/components/public.vue"),
  meta: {
    title: "商户管理",
    auth: false,
    show: true
  },
  redirect: { name: "ShopListPage" },
  children: [
    {
      path: "list",
      name: "ShopListPage",
      component: () => import("@/pages/shop/shopList.vue"),
      meta: {
        title: "商户列表",
        auth: false,
        show: true
      }
    },
    {
      path: "detail",
      name: "ShopDetailPage",
      component: () => import("@/pages/shop/shopDetail.vue"),
      meta: {
        title: "商户详情",
        auth: false,
        show: false
      }
    },
    {
      path: "orders",
      name: "ShopOrdersPage",
      component: () => import("@/pages/shop/orderList.vue"),
      meta: {
        title: "订单列表",
        auth: false,
        show: true
      }
    },
    {
      path: "orderDetail/:id",
      name: "ShopOrderDetailPage",
      component: () => import("@/pages/shop/orderDetail.vue"),
      meta: {
        title: "订单详情",
        auth: false,
        show: false
      }
    },
    {
      path: "return",
      name: "ShopReturnPage",
      component: () => import("@/pages/shop/shopReturn.vue"),
      meta: {
        title: "退款退货列表",
        auth: false,
        show: true
      }
    },
    {
      path: "settles",
      name: "ShopSettlePage",
      component: () => import("@/pages/shop/shopSettle.vue"),
      meta: {
        title: "商户结算列表",
        auth: false,
        show: true
      }
    }
  ]
};
