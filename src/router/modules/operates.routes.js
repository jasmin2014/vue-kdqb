import conpons from "./operates/conpons.routes";
import versions from "./operates/versions.routes";
import pages from "./operates/pages.routes";
import luckdraw from "./operates/luckydraw.routes";
export default {
  path: "operate",
  name: "Operate",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "OperateFlowGeneManagePage" },
  children: [
    // pages,
    {
      path: "page",
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
    },
    {
      path: "actives",
      name: "OperateActivesPage",
      component: () => import("@/pages/operate/actives/list.vue"),
      meta: {
        title: "活动列表",
        auth: false,
        show: true
      }
    },
    {
      path: "addActives",
      name: "OperateAddActivesPage",
      component: () => import("@/pages/operate/actives/add.vue"),
      meta: {
        title: "活动配置",
        auth: false,
        show: false
      }
    },
    {
      path: "stategies",
      name: "OperateStategiesPage",
      component: () => import("@/pages/operate/stategies/list.vue"),
      meta: {
        title: "策略促销",
        auth: false,
        show: true
      }
    },
    {
      path: "addStategies",
      name: "OperateAddStategiesPage",
      component: () => import("@/pages/operate/stategies/add.vue"),
      meta: {
        title: "增加促销",
        auth: false,
        show: false
      }
    },
    conpons,
    {
      path: "flow",
      name: "OperateFlowGeneManagePage",
      component: () => import("@/pages/operate/flowGeneralizeManage.vue"),
      meta: {
        title: "流量推广管理",
        auth: false,
        show: true
      }
    },
    {
      path: "addgeneralize",
      name: "OperateAddGeneralizePage",
      component: () => import("@/pages/operate/addGeneralize.vue"),
      meta: {
        title: "添加推广",
        auth: false,
        show: false
      }
    },
    {
      path: "invite",
      name: "OperateInviteRelationPage",
      component: () => import("@/pages/operate/inviteRelation.vue"),
      meta: {
        title: "邀请关系",
        auth: false,
        show: false
      }
    },
    // {
    //   path: "userlabels",
    //   name: "OperateUserLabelsPage",
    //   component: () => import("@/pages/operate/labels/list.vue"),
    //   meta: {
    //     title: "用户标签管理",
    //     auth: false,
    //     show: true
    //   }
    // },
    // {
    //   path: "labeldetail/:id",
    //   name: "OperateSeeLabelsPage",
    //   component: () => import("@/pages/operate/labels/detail.vue"),
    //   meta: {
    //     title: "用户标签管理-查看",
    //     auth: false,
    //     show: false
    //   }
    // },
    // {
    //   path: "labeledit/:id",
    //   name: "OperateEditLabelsPage",
    //   component: () => import("@/pages/operate/labels/edit.vue"),
    //   meta: {
    //     title: "用户标签管理-编辑",
    //     auth: false,
    //     show: false
    //   }
    // },
    luckdraw,
    // versions,
    // {
    //   path: "recharge",
    //   name: "OperateRechargePage",
    //   component: () => import("@/pages/operate/recharge.vue"),
    //   meta: {
    //     title: "充值服务中心",
    //     auth: false,
    //     show: true
    //   }
    // }
    {
      path: "couponCenterConfig",
      name: "CouponCenterConfig",
      component: () => import("@/pages/operate/couponCenterConfig.vue"),
      meta: {
        title: "领券中心配置",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "运营管理",
    auth: false,
    show: true
  }
};
