import accountManage from "./finance/accountmange.route";
export default {
  path: "finance",
  name: "Finance",
  component: () => import("@/pages/components/public.vue"),
  redirect: { name: "FinanceLoanReviewPage" },
  children: [
    {
      path: "loanreview",
      name: "FinanceLoanReviewPage",
      component: () => import("@/pages/finance/loanReviewList.vue"),
      meta: {
        title: "财务放款审核",
        auth: false,
        show: true
      }
    },
    {
      path: "loanrule",
      name: "FinanceLoanRulePage",
      component: () => import("@/pages/finance/loanRuleList.vue"),
      meta: {
        title: "财务放款规则",
        auth: false,
        show: true
      }
    },
    {
      path: "reviewdetail/:id",
      name: "FinanceLoanReviewDetailPage",
      component: () => import("@/pages/finance/loanReviewDetail.vue"),
      meta: {
        title: "放款审核-查看详情",
        auth: false,
        show: false
      }
    },
    {
      path: "loan/:id",
      name: "FinanceLoanPage",
      component: () => import("@/pages/finance/loan.vue"),
      meta: {
        title: "放款审核-财务放款",
        auth: false,
        show: false
      }
    },
    {
      path: "creditmanage",
      name: "FinanceCreditManagePage",
      component: () => import("@/pages/finance/creditManageList.vue"),
      meta: {
        title: "贷款管理",
        auth: false,
        show: true
      }
    },
    {
      path: "refunds",
      name: "FinanceRefundsPage",
      component: () => import("@/pages/finance/repaymentList.vue"),
      meta: {
        title: "还款管理",
        auth: false,
        show: true
      }
    },
    {
      path: "bills",
      name: "FinanceCreditCardBillsPage",
      component: () => import("@/pages/finance/creditCardBillList.vue"),
      meta: {
        title: "信用卡账单",
        auth: false,
        show: true
      }
    },
    {
      path: "billdetail/:id",
      name: "FinanceBillDetailPage",
      component: () => import("@/pages/finance/billDetail.vue"),
      meta: {
        title: "月账单详情",
        auth: false,
        show: false
      }
    },
    {
      path: "creditmanagedeital/:id",
      name: "FinanceCreditManageDetailPage",
      component: () => import("@/pages/finance/creditManageDetail.vue"),
      meta: {
        title: "账单详情",
        auth: false,
        show: false
      }
    },
    {
      path: "fundrecords",
      name: "FinanceFundRecordsPage",
      component: () => import("@/pages/finance/fundRecordList.vue"),
      meta: {
        title: "资金流水",
        auth: false,
        show: true
      }
    },
    accountManage,
    {
      path: "withdraw",
      name: "FinanceWithdrawPage",
      component: () => import("@/pages/finance/withdrawList.vue"),
      meta: {
        title: "自动提现记录",
        auth: false,
        show: true
      }
    }
  ],
  meta: {
    title: "财务管理",
    auth: false,
    show: true
  }
};
