import http from "../lib/http";

/**===========获取七牛云的token============**/
export const getQiniuToken = () => {
  return http.common.get("v1/qiniu/upToken");
};

/**===========获取七牛云的图片地址==========**/
export const getPicUrls = uris => {
  return http.common.post("v1/qiniu/urls", uris);
};

//数据字典明细-根据dicCode查询
export const getSysEnum = dicCode => {
  return http.common.get("/basic/admin/sysDic/querySysDicByDicCode", {
    params: {
      dicCode
    }
  });
};

//所有枚举
export const getAllSysEnum = () => {
  return http.common.get(
    "/basic/admin/sysDic/queryDicItemAllByUseScope?useScope=1"
  );
};

//城市
export const getRegionEnum = () => {
  return http.common.get("/basic/admin/area/list");
};

/**===========oss文件上传==========**/

export const ossUpload = params => {
  return http.admin.post("/admin/oss/upload", params);
};

//查询所有渠道
export const getChannelList = isEnable => {
  return http.common.get(
    "/product/admin/channel/getAllEnableChannel?isEnable=" + isEnable
  );
};

//根据渠道编码查询渠道名称
export const getChannelNameByCode = codeName => {
  return http.common.get(
    `/product/admin/channel/getChannelByCode?channelCode=${codeName}`
  );
};

//查询用户详细信息
export const getPartyRealName = params => {
  return http.common.post("/basic/admin/party/getPartyRealName", params);
};
//查询登录信息
export const getUserLoginInfo = () => {
  return http.common.post("/basic/admin/party/getUserLoginInfo");
};
