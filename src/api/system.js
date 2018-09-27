import http from "../lib/http";
//数据字典-分页查询系统参数配置
export const getpageList= (params)=> {
  return http.common.post("/basic/admin/sysConfig/pageList",params)
}

//新增系统参数
export const addSysConfigInfo= (params)=> {
  return http.common.post("/basic/admin/sysConfig/addSysConfigInfo",params)
}

//系统参数配置查询
export const querySysConfigByParamCode= (params)=> {
  return http.common.get("/basic/admin/sysConfig/querySysConfigByParamCode",{params})
}

//更新系统参数配置信息
export const updateSysConfigInfo= (params)=> {
  return http.common.post("/basic/admin/sysConfig/updateSysConfigInfo",params)
}

//批量删除缓存
export const deleteBatchRedisCache= (params)=> {
  return http.common.get("/basic/admin/sysDic/deleteBatchRedisCache",{params})
}

//分页查询数据字典信息
export const dicItemPageList= (params)=> {
  return http.common.post("/basic/admin/sysDic/dicItemPageList",params)
}
