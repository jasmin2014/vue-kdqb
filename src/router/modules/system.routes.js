export default {
  path: "system",
  name: "System",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "SystemParameterPage" },
  children: [
    {
      path: "parameter",
      name: "SystemParameterPage",
      component: () => import("@/pages/system/parameter.vue"),
      meta: {
        title: "参数配置管理",
        auth: false,
        show: true
      }
    },
    {
      path: "dictionary",
      name: "SystemDictionaryPage",
      component: () => import("@/pages/system/dictionary.vue"),
      meta: {
        title: "数据字典管理",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "系统管理",
    auth: false,
    show: true
  }
};
