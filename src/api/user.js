import http from "../lib/http";

//用户
export const getLoginUser = () => {
  return http.common.get("v1/user/info");
};
export const logout = () => {
  return http.common.post("v1/user/_logout");
};
//获取左侧菜单接口
export const getMenus = () => {
  return http.common.get("basic/admin/menu/web/auth/menus");
};


/**================== 用户列表 ===========================**/
//用户管理列表
export const getUserList = params => {
  return http.common.post("/basic/admin/party/tPartyPageList", params);
};
//解锁账号
export const locked = (partyId, phone) => {
    return http.common.get(`/basic/admin/party/relieveUserLocked`, {
      params: {
        partyId: partyId,
        phone: phone
      }
    });
  }
;
//重置密码
export const resetPsd = params => {
  return http.common.post(`/basic/admin/party/resetPwdByPhone`, params);
};


/**================== 用户详情 ===========================**/

//用户详情
export const getUserBasicDetail = partyId => {
  return http.common.get(`/admin/party/getPartyInfo?partyId=${partyId}`);
};

//手动提现
export const accountPut = params => {
  return http.common.post(`/funds/front/withdraw/client`, params);
};

//还款登记列表
export const getRepayResList = partyId => {
  return http.common.get(`/finance//admin/repayOffline/list?partyId=${partyId}`);
};
//还款登记
export const repayRes = params => {
  return http.common.post(`/finance/admin/repayOffline/save`, params);
};

//授信记录
export const getAuditList = partyId => {
  return http.common.get(`/loan/admin/credit-application/list/${partyId}`);
};

//认证信息
export const getAuthInfo = partyId => {
  return http.common.get(`/loan/admin/borrower-verification/detail/${partyId}`);
};

//认证信息列表
export const getAuthList = (partyId,params) => {
  return http.common.get(`/loan/admin/borrower-verification/list/${partyId}`,{params});
};

//解绑银行卡
export const unbindCard = params => {
  return http.common.post(`/funds/admin/unbind/card`, params);
};

//解冻-冻结用户
export const accountFreeze = (partyId, status) => {
  return http.common.post(`/funds/admin/account/freeze?partyId=${partyId}&status=${status}`);
};

//历史绑卡查询
export const getBindCardList = (params) => {
  return http.common.get(`/funds/admin/bindingcardhistory/funds/query/`, {params});
};

//还款情况
export const getRepayment = partyId => {
  return http.common.get(`/finance/admin/creditbill/queryCreditBillAmount?partyId=${partyId}`);
};
//账户还款
export const accountRepay = params => {
  return http.common.post(`/finance//admin/repay`, params);
};

//借款个数
export const getStatusCount = partyId => {
  return http.common.get(`/finance/admin/loanApply/countByStatus?partyId=${partyId}`);
};

//借款
export const getLoanRecordList = params => {
  return http.common.post(`/finance/admin/loanApply/pageList`, params);
};

//信用卡月账单
export const getCreditbillList = params => {
  return http.common.post(`/finance/admin/creditbill/pageList`, params);
};

//资金流水-后台
export const getFundsBackstageList = params => {
  return http.common.post("/funds/admin/accountFlow/all", params);
};

//资金流水-前台
export const getReceptionList = params => {
  return http.common.post("/funds/front/accountFlow/all", params);
};

//费用类型-后台
export const getCostType = () => {
  return http.common.get("/funds/admin/accountFlow/queryFeeType");
};
//费用类型-前台
export const getFrontCostType = () => {
  return http.common.get("/funds/front/accountFlow/queryFeeType");
};


