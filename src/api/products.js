// 产品管理
import http from '../lib/http';

/** ================ 产品 ================ **/
//产品列表
//新增渠道
export const addChannel = (params) => {
  return http.common.post('/product/admin/channel/create',params)
}

//编辑渠道
export const editChannel = (params) => {
  return http.common.post('/product/admin/channel/edit',params)
}

//根据渠道编码查询渠道
export const getChannelByCode = (params) => {
  return http.common.get('/product/admin/channel/getChannelByCode',{params})
}

//分页查询渠道列表
export const getChannelByPage = (params) => {
  return http.common.get('/product/admin/channel/getChannelByPage',{params})
}

//启用/禁用渠道
export const enableChannel = (params) => {
  return http.common.get('/product/admin/channel/isEnable',{params})
}

//编辑产品规则
export const editRule = (params) => {
  return http.common.post('/product/admin/rule/edit',params)
}

//根据产品规则编码查询对应规则
export const getRuleByCode = (ruleCode) => {
  return http.common.get('/product/admin/rule/getRuleByCode?ruleCode='+ ruleCode)
}

//分页查询产品规则列表
export const getRuleByPage = (params) => {
  return http.common.get('/product/admin/rule/getRuleByPage',{params})
}

//启用/禁用规则
export const enableRule = (params) => {
  return http.common.get('/product/admin/rule/isEnable',{params})
}

//查询全部渠道
export const getAllEnableChannel = (params) => {
  return http.common.get('/product/admin/channel/getAllEnableChannel',{params})
}

//新增认证模型
export const createAuth = (params) => {
  return http.common.post('/product/admin/authModel/create',params)
}

//编辑认证模型
export const editAuth = (params) => {
  return http.common.post('/product/admin/authModel/edit',params)
}

//根据模型编码查询认证模型
export const getModelByCode = (params) => {
  return http.common.get('/product/admin/authModel/getModelByCode',{params})
}

//分页查询认证模型列表
export const getModelByPage = (params) => {
  return http.common.get('/product/admin/authModel/getModelByPage',{params})
}

//获取用户等级列表
export const getUserGradeByPage = (params) => {
  return http.common.get('/product/admin/userGrade/getUserGradeByPage',{params})
}

//根据用户等级编码获取用户等级
export const getUserGradeByCode = (userGradeCode) => {
  return http.common.get('/product/admin/userGrade/getUserGradeByCode?userGradeCode='+ userGradeCode)
}

//编辑用户等级
export const editUserGrade = (params) => {
  return http.common.post('/product/admin/userGrade/editUserGrade',params)
}

//查询全部可用产品规则
export const getAllEnableRule = (params) => {
  return http.common.get('/product/admin/rule/getAllEnableRule',{params})
}

//根据渠道查询所有认证
export const getModelByChannel = (params) => {
  return http.common.get('/product/admin/authModel/getModelByChannel',{params})
}
