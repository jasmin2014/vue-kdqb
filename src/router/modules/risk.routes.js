export default {
  path: "risk",
  name: "Risk",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "RiskAuditRecordsPage" },
  children: [
    {
      path: "auditrecords",
      name: "RiskAuditRecordsPage",
      component: () => import("@/pages/risk/auditRecords.vue"),
      meta: {
        title: "风控审核记录",
        auth: false,
        show: true
      }
    },
    {
      path: "recorddetail/:id",
      name: "RiskAuditRecordsDetailPage",
      component: () => import("@/pages/risk/auditRecordsDetail.vue"),
      meta: {
        title: "风控审核记录详情",
        auth: false,
        show: false
      }
    },
    {
      path: "amountmanage",
      name: "RiskAmountMangePage",
      component: () => import("@/pages/risk/amountManage.vue"),
      meta: {
        title: "用户额度管理",
        auth: false,
        show: true
      }
    },
    {
      path: "amountpolling",
      name: "RiskAmountPollingPage",
      component: () => import("@/pages/risk/amountPolling.vue"),
      meta: {
        title: "额度巡查记录",
        auth: false,
        show: true
      }
    },
    {
      path: "pollingdetail/:id",
      name: "RiskAmountPollingDetailPage",
      component: () => import("@/pages/risk/amountPollingDetail.vue"),
      meta: {
        title: "额度巡查详情",
        auth: false,
        show: false
      }
    },
    {
      path: "locationmanage",
      name: "RiskLocationMangePage",
      component: () => import("@/pages/risk/locationManage.vue"),
      meta: {
        title: "定位管理",
        auth: false,
        show: true
      }
    },
    {
      path: "devicemanage",
      name: "RiskDeviceMangePage",
      component: () => import("@/pages/risk/deviceManage.vue"),
      meta: {
        title: "设备管理",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "风控管理",
    auth: false,
    show: true
  }
};
