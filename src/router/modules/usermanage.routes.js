export default {
  path: "user",
  name: "Users",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "UsersPage" },
  children: [
    {
      path: "list",
      name: "UsersPage",
      component: () => import("@/pages/usermanage/userList.vue"),
      meta: {
        title: "用户列表",
        auth: false,
        show: true
      }
    },
    {
      path: "detail/:id",
      name: "UserDetailPage",
      component: () => import("@/pages/usermanage/userDetail.vue"),
      meta: {
        title: "用戶详情",
        auth: false,
        show: false
      }
    },
    {
      path: "auth/:id",
      name: "UserAuthInfo",
      component: () => import("@/pages/usermanage/userAuthInfo.vue"),
      meta: {
        title: "用戶认证信息",
        auth: false,
        show: false
      }
    }
  ],
  meta: {
    title: "用戶管理",
    auth: false,
    show: true
  }
};
