// 债权管理
import http from '../lib/http';

//条件分页查询借款申请池
export const getLoanApplicationPool = (params) => {
  return http.common.get('/finance/admin/loan-application-pool',{params})
}

//借款申请池中推送
export const loanApplicationPoolPush = (params) => {
  return http.common.post('/finance/admin/loan-application-pool/_push',params)
}

//借款申请池中撤回申请
// export const loanApplicationPoolRecall = (params) => {
//   return http.admin.post('/finance/admin/loan-application-pool/_recall',params)
// }

//资产配置
//分页查询资产配置
export const getAssetConfig = (params) => {
  return http.common.get('/finance/admin/asset-config',{params})
}

//新增资产配置
export const addAssetConfig = (params) => {
  return http.common.post('/finance/admin/asset-config',params)
}

//通过资产分类id查找资产配置详情
export const getAssetConfigById = (assetConfigId) => {
  return http.common.get(`/finance/admin/asset-config/${assetConfigId}`)
}

//编辑资产配置
export const editAssetConfig = (assetConfigId,params) => {
  return http.common.put(`/finance/admin/asset-config/${assetConfigId}`, params);
}

