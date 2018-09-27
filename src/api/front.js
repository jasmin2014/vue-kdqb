import http from '../lib/http'

/**===========oss文件上传==========**/
export const ossUpload = (params) => {
  return http.common.post('loan/admin/oss/upload',params,{headers:{"Content-Type":'multipart/form-data'}})
}
