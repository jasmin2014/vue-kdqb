import http from "../lib/http";

/**=============风控审核记录================**/
/**
 *
 * 审核列表查询 - 全部、待签收、已签收、已审核
 *
 * @param params
 * {
 *   applicationId: '贷款编号',
 *   channelCode: '渠道名称',
 *   applicationType:'申请类型',
 *   mobile:'登录手机号码',
 *   realName:'姓名',
 *   startApplicationTime:'申请开始时间,格式yyyy-MM-dd',
 *   endApplicationTime:'申请结束时间,格式yyyy-MM-dd',
 *   status:'前端状态,枚举:APPLICATION_STATUS',
 *   currStep:'审核节点,枚举:REVIEW_STATUS',
 *   auditStaffNo:'审核工号',
 *   auditor:'审核人',
 *   pageNum: '页码',
 *   pageSize: '每页条数'
 * }
 *
 * @returns {object}
 * {
 * "code": "200",
 * "message": "",
 * "body": {
 *   "pageNum": 1,
 *   "pageSize": 10,
 *   "total": 2,
 *   "totalPages": 1,
 *   "content": [
 *     {
 *       "id": "",
 *       "applicationId": "贷款编号",
 *       "channelCode": "渠道编号过滤渠道名称",
 *       "applicationType": "applicationType",
 *       "mobile": "登录手机号码",
 *       "realName": "姓名",
 *       "applicationTime": "申请开始时间",
 *       "status": "前端状态",
 *       "currStep": "审核节点",
 *       "auditStaffNo": "审核工号"
 *     }
 *   ]
 * }
 *
 */
export const getAllRiskList = params => {
  return http.common.get("/loan/admin/process-audit/all/page", { params });
};

//审核列表查询-待签收
export const getWaitSignList = params => {
  return http.common.get("/loan/admin/process-audit/to-do/page", { params });
};

//审核列表查询-已签收
export const getAlreadySignList = params => {
  return http.common.get("/loan/admin/process-audit/doing/page", { params });
};

//审核列表查询-已审核
export const getAlreadyAuthList = params => {
  return http.common.get("/loan/admin/process-audit/done/page", { params });
};

//审核列表查询-待签收-签收按钮操作
export const putAccessAuditSign = processFlowId => {
  return http.common.put(`/loan/admin/process-audit/_signing/${processFlowId}`);
};

//审核列表查询-已签收-退签按钮操作
export const putAccessAuditSignOut = processFlowId => {
  return http.common.put(`/loan/admin/process-audit/_refund/${processFlowId}`);
};

//风控审核详情 - 获取基础信息接口
export const getAllBaseDetail = (applicationId, applicationType) => {
  return http.common.get(
    `/loan/admin/process-audit/detail-basic/${applicationId}?applicationType=${applicationType}`
  );
};

//风控审核详情-基本信息-查看历史申请-借款申请
export const getBaseLoanRecords = (partyId, params) => {
  return http.common.get(`/loan/admin/process-audit/history-loan/${partyId}`, {
    params
  });
};

//风控审核详情-基本信息-查看历史申请-授信申请
export const getBaseCreditRecords = (partyId, params) => {
  return http.common.get(
    `/loan/admin/process-audit/history-credit/${partyId}`,
    {
      params
    }
  );
};

//风控审核详情-基本信息-查看关联记录申请
export const getRelationRecords = (mobile, params) => {
  return http.common.get(`/loan/admin/process-audit/relation-apply/${mobile}`, {
    params
  });
};

//风控审核详情-申请表接口
export const getApplicationForms = (applicationId, formType) => {
  return http.common.get(
    `/loan/admin/process-audit/application-form/${applicationId}?formType=${formType}`
  );
};

//风控审核详情-自动填充接口
export const putDetailAutoFillApplications = (
  applicationId,
  applicationType
) => {
  return http.common.put(
    `/loan/admin/process-audit/_filling/${applicationId}?applicationType=${applicationType}`
  );
};

//风控审核详情 - 风控决策报告
export const getProccessAuditReports = applicationId => {
  return http.common.get(`/loan/admin/process-audit/report/${applicationId}`);
};

//审核列表查询-详情-审核记录
export const getDetailAuditList = applicationId => {
  return http.common.get(`/loan/admin/process-audit/record/${applicationId}`);
};

//审核列表查询-详情-电核记录
export const getDetailElecticalRecords = (applicationId, params) => {
  return http.common.get(`/loan/admin/process-audit/page/${applicationId}`, {
    params
  });
};

//审核列表查询-详情-电核记录-添加电核记录操作
export const addElecticalRecord = params => {
  return http.common.post("/loan/admin/process-audit", params);
};

//审核列表查询-详情-审核通过不通过-用户标签获取接口
export const getDetailRiskLable = label => {
  return http.common.get(`/loan/admin/risk-label?label=${label}`);
};

//审核列表查询-详情-审核通过接口
export const postPassAudit = params => {
  return http.common.put("/loan/admin/process-audit/_approved", params);
};

//审核列表查询-详情-审核不通过接口
export const postRejectPassAudit = params => {
  return http.common.put("/loan/admin/process-audit/_refused", params);
};

//审核列表查询-详情-认证情况接口
export const getVerificationDetail = partyId => {
  return http.common.get(`/loan/admin/borrower-verification/detail/${partyId}`);
};

//审核列表查询-详情-认证历史接口
export const getVerificationHistory = (partyId, params) => {
  return http.common.get(`/loan/admin/borrower-verification/list/${partyId}`, {
    params
  });
};

//审核列表查询-详情-下载通讯录
export const downAddressList = params => {
  return http.common.post(
    "/basic/admin/phoneContactsBook/exportExcel",
    params,
    {
      responseType: "blob"
    }
  );
};

//审核列表查询-详情-通讯录数据
export const getAddressList = params => {
  return http.common.post(
    "/basic/admin/phoneContactsBook/getContactBookDetail",
    params
  );
};

/**===============用户额度管理================**/
//用户额度列表解耦
export const manageAmountList = params => {
  return http.common.post("/finance/admin/user/pageList", params);
};

//编辑用户额度
export const editUserAmount = params => {
  return http.common.post("/finance/admin/user/edit", params);
};

//查看编辑记录
export const seeHistoryEditRecords = params => {
  return http.common.post("/finance/admin/user/history", params);
};

//解除或恢复授信
export const updateBindStatus = params => {
  return http.common.get("/finance/admin/user/updateBindStatus", { params });
};

/**================设备管理=================**/
//用户设备管理列表查询
export const getDeviceList = params => {
  return http.common.post("/basic/admin/devicesManager/pageList", params);
};

/**================定位管理================**/
//定位管理列表查询接口
export const getLocationList = params => {
  return http.common.post("/basic/admin/position/pageList", params);
};

/**===========额度巡检记录管理==============**/
//额度巡检记录列表
export const getAmountPollingList = params => {
  return http.common.post("/basic/admin/creditLineRoundCheck/pageList", params);
};
//额度巡检详情-申请表接口
export const getApplicationFormsInPolling = (applicationId, formType) => {
  return http.common.get(
    `/basic/admin/creditLineRoundCheck/applicationForm/${applicationId}?formType=${formType}`
  );
};
//额度巡检详情-查看报告
export const getReportUrl = creditLineRoundCheckId => {
  return http.common.get(
    `/basic/admin/creditLineRoundCheck/decisionReportUrl/${creditLineRoundCheckId}`
  );
};
//取消限制天数
export const cancelLimitDays = partyId => {
  return http.common.get(
    `/basic/admin/creditLineRoundCheck/cancleCheckRoundAppDays/${partyId}`
  );
};
