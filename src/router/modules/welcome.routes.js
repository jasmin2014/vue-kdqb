export default {
  path: 'welcome',
  name: 'Welcome',
  component: () => import('@/pages/components/public.vue'),
  redirect: {name:'WelcomeAll'},
  children: [
    {
      path: 'all',
      name: 'WelcomeAll',
      component: () => import('@/pages/dashbord/welcome.vue'),
      meta: {
        title: '欢迎进入',
        show: false
      }
    }
  ],
  meta: {
    title: '管理系统',
    show: false
  }
}
