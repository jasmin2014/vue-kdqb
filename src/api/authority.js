import http from "../lib/http";

/* --------------- 角色管理 --------------- */
export const getAuthList = () => {
  return http.admin.get('v1/party/person/list/page', {
    params
  });
};

/* --------------- 账号管理 --------------- */
export const getManageList = (params) => {
  return http.admin.get('v1/manager/list/page', {
    params
  });
};
/* --------------- 账号详情 --------------- */
export const getManageDetail = (partyId) => {
  return http.admin.get(`v1/manager/detail/${partyId}`);
};
/* --------------- 更新账号信息 --------------- */
export const updateManage = (params) => {
  return http.admin.put(`v1/manager/${params.partyId}?name=${params.name}`);
};
