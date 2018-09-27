export default {
  path: "version",
  name: "Versions",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "OperateVersionsListPage" },
  children: [
    {
      path: "list",
      name: "OperateVersionsListPage",
      component: () => import("@/pages/operate/versions/list.vue"),
      meta: {
        title: "版本管理",
        auth: false,
        show: true
      }
    },
    {
      path: "content",
      name: "OperateVersionContentPage",
      component: () => import("@/pages/operate/versions/content.vue"),
      meta: {
        title: "版本内容管理",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "版本管理",
    auth: false,
    show: true
  }
};
