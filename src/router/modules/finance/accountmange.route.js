export default {
  path: "account",
  name: "AccountMange",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "FinanceAccountAlreadyDonePage" },
  children: [
    {
      path: "already",
      name: "FinanceAccountAlreadyDonePage",
      component: () => import("@/pages/finance/accountManage/already.vue"),
      meta: {
        title: "已办列表",
        auth: false,
        show: true
      }
    },
    {
      path: "wait",
      name: "FinanceAccountWaitPage",
      component: () => import("@/pages/finance/accountManage/wait.vue"),
      meta: {
        title: "待办列表",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "调账划账管理",
    auth: false,
    show: true
  }
};
