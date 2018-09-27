export default {
  path: "luckydraw",
  name: "luckydraw",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "LuckyDrawActivityList" },
  children: [
    {
      path: "activityList",
      name: "LuckyDrawActivityList",
      component: () => import("@/pages/operate/luckydraw/activityList.vue"),
      meta: {
        title: "抽奖活动管理",
        auth: false,
        show: true
      }
    },
    {
      path: "winnerList",
      name: "LuckyDrawWinnerList",
      component: () => import("@/pages/operate/luckydraw/winnerList.vue"),
      meta: {
        title: "中奖查询发放",
        auth: false,
        show: true
      }
    },
    {
      path: "pageManage",
      name: "LuckyDrawpageManage",
      component: () => import("@/pages/operate/luckydraw/pageManage.vue"),
      meta: {
        title: "抽奖页面编辑",
        auth: false,
        show: false
      }
    },
    {
      path: "pageList",
      name: "LuckyDrawPageList",
      component: () => import("@/pages/operate/luckydraw/pageList.vue"),
      meta: {
        title: "抽奖页面管理",
        auth: false,
        show: true
      }
    },
    {
      path: "add",
      name: "LuckyDrawAddPage",
      component: () => import("@/pages/operate/luckydraw/add.vue"),
      meta: {
        title: "新增抽奖",
        auth: false,
        show: false
      }
    }
  ],
  meta: {
    title: "抽奖管理",
    auth: false,
    show: true
  }
};
