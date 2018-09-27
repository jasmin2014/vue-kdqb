// 财务管理
import http from "../lib/http";

/**=============财务放款规则===============**/
//财务放款规则列表
export const getGrantRule = params => {
  return http.common.get("product/admin/grantRule/list", { params });
};

/** ================ 调账划账管理 ================ **/
//已办列表
export const getAdjustList = params => {
  return http.common.post("/finance/admin/adjustFunds/donePageList", params);
};

//待办列表
export const getWaitAdjustList = params => {
  return http.common.post("/finance/admin/adjustFunds/undonePageList", params);
};

//详情
export const getAdjustDetail = adjustmentFundsId => {
  return http.common.get(
    "/finance/admin/adjustFunds/detail?adjustmentFundsId=" + adjustmentFundsId
  );
};
//详情-操作失败-重新提交接口
export const adjustFundsRetry = adjustId => {
  return http.common.post(`/finance/admin/adjustFunds/retry/${adjustId}`);
};
//删除
export const delAdjust = adjustId => {
  return http.common.delete(`/finance/admin/adjustFunds/del/${adjustId}`);
};

//审核
export const auditAdjustFunds = params => {
  return http.common.post("/finance/admin/adjustFunds/audit", params);
};
//批量审核
export const batchAudit = params => {
  return http.common.post("/finance/admin/adjustFunds/batchAudit", params);
};
//添加申请
export const addAdjustFunds = params => {
  return http.common.post("/finance/admin/adjustFunds", params);
};
//申请制单查询id
export const getAdjustId = cellphone => {
  return http.common.post(`/basic/admin/party/getUserInfoByCellphone?cellphone=${cellphone}`);
};
//下载
export const downLoanApply = () => {
  return http.common.get("/finance/admin/adjustFunds/template",  {
    responseType: "blob"
  });
};
//导入
export const uploadLoanApply = (file) => {
  return http.common.post("/finance/admin/adjustFunds/upload", file,{
    responseType: 'blob'
  });
};
//机构账户获取
export const getItAccount = paramCode => {
  return http.common.get(
    "/basic/admin/sysConfig/querySysConfigByParamCode?paramCode=" + paramCode
  );
};
/** ================ 放款审核 ================ **/
//放款审核列表-已审核
export const getLoannedList = params => {
  return http.common.post("/finance/admin/loanApply/grantPageList", params);
};

//放款审核-已审核-详情
export const getAlreadyLoanDetail = loanApplyId => {
  return http.common.get(
    "/finance/admin/loanApply/detailAboutCancel?loadApplyId=" + loanApplyId
  );
};

//放款审核列表-已审核-下载
export const downAlreadyAuditList = params => {
  return http.common.post("/finance/admin/loanApply/grant/exportExcel", params, {
    responseType: "blob"
  });
};

//放款审核列表-待审核
export const getWaitLoanList = params => {
  return http.common.post("/finance/admin/loanApply/grantpendPageList", params);
};

//放款账户列表
export const getRepayAccount = dicCode => {
  return http.common.get(`/basic/admin/sysDic/querySysDicByDicCode?dicCode=${dicCode}`);
};

//查询余额
export const getAccountAmount = partyId => {
  return http.common.get(`/funds/admin/account/query?partyId=${partyId}`);
};
//批量放款
export const batchLoan = params => {
  return http.common.post(`/finance/admin/loanConfirm/batch`,params);
};
//确认放款
export const loanConfirm = (params) => {
  return http.common.post("/finance/admin/loanConfirm", params);
};

//终止放款
export const stopConfirm = params => {
  return http.common.post("/finance/admin/loanConfirm/stopConfirm", params);
};
/**===============贷款管理=================**/
//贷款管理-按条件分页查询借款申请列表
export const getLoanList = params => {
  return http.common.post("/finance/admin/loanApply/pageList", params);
};

//贷款管理-按条件分页查询贷款列表-详情
export const getLoanDetail = loadApplyId => {
  return http.common.get(
    "/finance/admin/loanApply/detail?loadApplyId=" + loadApplyId
  );
};

//贷款管理-按条件分页查询贷款列表-详情-账单明细相关金额计算
export const getLoanDetailAmountCalc = (partyId, loanApplyId) => {
  return http.common.get(
    "/finance/admin/loanbill/queryLoanBillAmount?partyId=" +
      partyId +
      "&loanApplyId=" +
      loanApplyId
  );
};

//贷款管理-按条件分页查询借款申请列表下载
export const downLoadLoanList = params => {
  return http.common.post("/finance/admin/loanApply/exportExcel", params, {
    responseType: "blob"
  });
};

/** ================ 还款管理 ================ **/
//还款管理列表 已对接完成 - (渠道接口列表接口待对接)
export const getRepayList = params => {
  return http.common.post("/finance/admin/loanbill/pageList", params);
};

//下载还款列表 已对接完成
export const downLoadList = params => {
  return http.common.post("/finance/admin/loanbill/exportExcel", params, {
    responseType: "blob"
  });
};

/** ================ 信用卡月账单 ================ **/
//信用卡月账单列表
export const getCreditCardList = params => {
  return http.common.post("/finance/admin/creditbill/pageList", params);
};

//信用卡月账单详情接口
export const getCreditCardDetail = creditBillId => {
  return http.common.get(
    "/finance/admin/creditbill/detail?creditBillId=" + creditBillId
  );
};

//信用卡月账单详情里面月账单交易记录接口
export const getTradingRecordsList = params => {
  return http.common.post("/finance/admin/creditbillDtl/pageList", params);
};

//信用卡月账单下载接口
export const downLoadCreditCardList = params => {
  return http.common.post("/finance/admin/creditbill/exportExcel", params, {
    responseType: "blob"
  });
};

/**==============财务放款规则================**/
//按条件分页查询财务放款规则
export const getGrantRules = params => {
  return http.common.post("/product/admin/grantRule/pageList", params);
};

//按条件分页查询财务放款规则-编辑
export const editGrantRule = params => {
  return http.common.post("/product/admin/grantRule/edit", params);
};

//新增放款规则
export const addGrantRule = params => {
  return http.common.post("/product/admin/grantRule/save", params);
};

/**==============资金流水================**/
//资金流水-后台
export const getFundsList = params => {
  return http.common.post("/funds/admin/accountFlow/all", params);
};
//费用类型-后台
export const getCostType = () => {
  return http.common.get("/funds/admin/accountFlow/queryFeeType");
};

/**==============自动提现记录================**/
//列表
export const getWithdrawList = params => {
  return http.common.post("/finance/admin/withdraw/list", params);
};

