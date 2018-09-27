export default {
  path: 'account',
  name: 'Account',
  component: () => import('@/pages/components/public.vue'),
  redirect: {name:'LoginPage'},
  children: [
    {
      path: 'reset',
      name: 'ResetPage',
      component: () => import('@/pages/account/reset.vue')
    },
    {
      path: 'login',
      name: 'LoginPage',
      component: () => import('@/pages/account/login.vue')
    }
  ]
}
