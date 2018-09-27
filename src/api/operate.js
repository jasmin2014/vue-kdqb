import http from "../lib/http";
const baseUrl = '/promotion/admin/'
// const baseUrl  = 'admin'
// const luckyDrawUrl = 

// params对象参数转换为query查询方式
const params2query = function (params) {
    let queryarr = []
    Object.keys(params).forEach(i => {
        let item = typeof params[i] === 'object' ? JSON.stringify(params[i]) : params[i]
        params[i] != undefined && queryarr.push(`${i}=${encodeURIComponent(item)}`
        )
    })
    return queryarr.join('&')
}

/** ================ 页面配置管理 ================ **/
//获取页面列表
export const getPageList = (params) => {
    return http.v1.get(`funds-cms-admin/page/kd`, { params })
}
//新增页面
export const addPage = (params) => {
    return http.v1.post(`funds-cms-admin/page/kd`, params)
}
//发布、下架页面
export const switchPage = (params) => {
    return http.v1.put(`funds-cms-admin/page/releaseSwitch/${params.pageId}`, params)
}
//删除页面 
export const deletePage = (params) => {
    return http.v1.delete(`funds-cms-admin/page/kd/${params.pageId}`, params)
}
// 查询页面内容
export const getPageContent = (params) => {
    return http.v1.get(`funds-cms-admin/page/content/${params.pageId}`, params)
}
// 编辑页面内容
export const putPageContent = (params) => {
    return http.v1.put(`funds-cms-admin/page/content/${params.pageId}`, params.body)
}

/** ================ 活动运营 ================ **/
// 活动列表
export const getActivityList = (params) => {
    return http.common.post(`${baseUrl}/activity/list`, params)
}
// 添加活动和配置
export const addActivity = (params) => {
    return http.common.post(`${baseUrl}/activity`, params)
}
// 开启、关闭活动
export const switchActivity = (activityId, isEnabled) => {
    return http.common.put(`${baseUrl}/activity/switch/${activityId}/${isEnabled}`)
}
// 编辑活动和配置
export const putActivity = (activityId, params) => {
    return http.common.put(`${baseUrl}/activity/${activityId}`, params)
} 
// 活动删除
export const delActivity = (activityId) => {
    return http.common.delete(`${baseUrl}/activity/${activityId}`)
}
// 查询活动和配置
export const queryActivity = (activityId) => {
    return http.common.get(`${baseUrl}/activity/${activityId}`)
}

// 活动商品添加模板下载
export const activityDownload = () => {
    return http.common({
        method: 'get',
        url: `${baseUrl}/activity/download`,
        responseType: 'blob'
    })
}
// 活动商品添加模板上传地址
export const getBatchUploadUrl = `/api/common/${baseUrl}/activity/batch/upload`

// 下载失败数据
export const activityErrorDownload = (file) => {
    var fd = new FormData()
    fd.append('file', file)
    return http.common.post(`${baseUrl}/activity/error/download`, fd, { responseType: 'blob' })
}

// 数据字典明细-根据dicCode查询
// export const getBusinessType = () => {
//     return http.common.get(`admin/sysDic/querySysDicByDicCode?dicCode=BUSINESS_TYPE`)
// }

/** ================ 绑定商户渠道列表 ================ **/
// 分页查询渠道列表
export const getChannelList = (params) => {
    return http.common.get(`product/admin/channel/getChannelByPage?pageNum=${params.pageNum}&pageSize=${params.pageSize}`)
}
// 分页查询商户信息
export const getShopInfoList = (params) => {
    return http.common.post(`shop/admin/shopInfo/list`, params)
}

/** ================ 策略促销 ================ **/
// 策略促销列表查询
export const getPromotionList = (params) => {
    return http.common.post(`${baseUrl}/strategy/promotion/list`, params)
}
// 策略促销新增
export const addPromotion = (params) => {
    return http.common.post(`${baseUrl}/strategy/promotion`, params)
}
// 开启、关闭策略
export const switchPromotion = (strategyId, isEnabled) => {
    return http.common.put(`${baseUrl}/strategy/promotion/switch/${strategyId}/${isEnabled}`)
}
// 策略促销删除
export const delPromotion = (strategyId) => {
    return http.common.delete(`${baseUrl}/strategy/promotion/${strategyId}`)
}
// 策略促销查询
export const queryPromotion = (strategyId) => {
    return http.common.get(`${baseUrl}/strategy/promotion/${strategyId}`)
}

/** ================ 卡券管理 ================ **/
// **** 卡券发行
// 卡券发行-列表
export const getCouponList = (params) => {
    return http.v1.get(`/coupon/admin/publish/page/list`, { params })
}
// 卡券作废-下架
export const publishInvalidate = (params) => {
    return http.v1.post(`/coupon/admin/publish/invalidate`, params2query(params) , { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
}
// 卡券发行-取消
export const publishCancel = (params) => {
    return http.v1.post(`/coupon/admin/publish/cancel`, params2query(params) , { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
}
// 卡券发行-查看
export const getCouponInfo = (id) => {
    return http.v1.get(`/coupon/admin/publish/info?id=${id}`)
}
// 卡券发行-添加
export const addCouponInfo = (params) => {
    return http.v1.post(`/coupon/admin/publish/add`, params)
}
// 卡券发行-编辑
export const editCouponInfo = (params) => {
    return http.v1.post(`/coupon/admin/publish/edit`, params)
}

// ***** 卡券发放
// 卡券发放-卡券发放查询
export const getInfoPageList = (params) => {
    return http.v1.get(`/coupon/admin/info/page/list?${params2query(params)}`)
}
// 卡券发放-获取领取状态中的卡券列表
export const getPublishedList = () => {
    return http.v1.get(`/coupon/admin/publish/list`)
}

// 卡券发放-下载导入模板地址
export const getPublicDownloadUrl = 'http://peigl627i.bkt.clouddn.com/coupon/template/coupon-publish-template.xlsx'

// 卡券发放-下载导入模板地址
export const getPublicUploadUrl = '/api/v1/coupon/admin/publish/direct/import'

// 卡券发放-导出错误信息
export const couponPublicExport = (params) => {
    return http.v1.post(`/coupon/admin/publish/direct/export`, params2query(params), { headers: { "Content-Type": "application/x-www-form-urlencoded" }, responseType: 'blob' })
}
// 卡券发放-提交发放信息
export const couponPublicDirect = (params) => {
    return http.v1.post(`/coupon/admin/publish/direct`, params2query(params), { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
}

//卡券绑定列表 
export const getCouponPublishedList = (params) => {
    return http.v1.get(`/coupon/admin/publish/binding/list`, params)
}

/** ================ 流量推广管理 ================ **/
// 分页查询流量推广管理
export const getFlowList = (params) => {
    return http.common.post(`basic/admin/channel/pageList?${params2query(params)}`)
}
// 新增推广配置接口
export const addPromote = (params) => {
    return http.common.post(`basic/admin/channel/save`, params)
}
// 根据id编辑推广配置接口
export const putPromote = (params) => {
    return http.common.post(`basic/admin/channel/edit`, params)
}
// 根据渠道配置表Id查询
export const getFlowInfo = (id) => {
    return http.common.get(`basic/admin/channel/getByChannelId?channelId=${id}`)
}
// 启用禁用渠道配置信息
export const enableFlowInfo = (params) => {
    return http.common.get(`basic/admin/channel/enable?${params2query(params)}`)
}



/** ================ 抽奖管理 ================ **/
//获取抽奖列表
export const getLuckyDrawList = (params) => {
    return http.common.get(`${baseUrl}/luckyDraw/list`, { params })
}
//新增抽奖
export const addLuckyDraw = (params) => {
    return http.common.post(`${baseUrl}/luckyDraw/add`, params)
}
//删除抽奖活动 
export const deleteLuckDraw = (params) => {
    return http.common.put(`${baseUrl}/luckyDraw/delete/${params.luckyDrawId}`)
}
//开启关闭抽奖活动
export const switchLuckyDrawStatus = (params) => {
    return http.common.put(`${baseUrl}/luckyDraw/switch/${params.luckyDrawId}/${params.isEnabled}`, { params })
}
//查看抽奖奖池奖品列表 
export const getLuckyDrawById = (params) => {
    return http.common.get(`${baseUrl}/luckyDraw/prize/list/detail/${params.luckyDrawId}`)
}
//修改抽奖
export const updateLuckyDrawById = (params) => {
    return http.common.post(`${baseUrl}/luckyDraw/update/${params.luckyDrawId}`, params)
}
//根据抽奖id查询抽奖详情
export const getLuckyDrawPrizeList = (params) => {
    return http.common.get(`${baseUrl}/luckyDraw/prize/list/${params.luckyDrawId}`, { params })
}
//抽奖商品上下架 
export const prizeStatusSwitch = (params) => {
    return http.common.put(`${baseUrl}/prize/switch/${params.prizeId}/${params.isEnabled}`)
}



/******/

//中奖发放查询 
export const luckyDrawParticipateList = (params) => {
    return http.common.get(`${baseUrl}/luckyDrawParticipate/list`, { params }, { headers: { "Content-Type": "application/x-www-form-urlencoded" } })
}
//开启、关闭抽奖参与订单 
export const switchLuckyDrawParticipate = (params) => {
    return http.common.put(`${baseUrl}/luckyDrawParticipate/switch/${params.participateId}/${params.isEnabled}`, { params })
}
//导出抽奖参与明细
export const exportLuckyDrawParticipate = (params) => {
    return http.common.post(`${baseUrl}/luckyDrawParticipate/export`, params, {
        responseType: "blob"
    })
}
//确认发放中奖奖品 /
export const issueLuckyDrawParticipate = (params) => {
    return http.common.post(`${baseUrl}/luckyDrawParticipate/issue`, params)
}

/********/

//获取抽奖页面列表 
export const getLuckyDrawPageList = (params) => {
    return http.common.get(`${baseUrl}/luckyDrawPage/list`, { params })
}
//新增抽奖页面
export const addLuckyDrawPageList = (params) => {
    return http.common.post(`${baseUrl}/luckyDrawPage/add`, params)
}
//查询抽奖页面详情
export const getLuckyDrawPageDetail = (params) => {
    return http.common.get(`${baseUrl}/luckyDrawPage/query/${params.luckyDrawPageId}`)
}
//查询可以绑定抽奖页面的活动列表
export const getLuckDrawUsableActivity = (params) => {
    return http.common.get(`${baseUrl}/activity/list/luckyDraw`, params)
}
//通过活动id查看抽奖奖品列表
export const getPrizeListByActivityId = (params) => {
    return http.common.get(`${baseUrl}/luckyDrawPage/prize/list/detail/${params.activityId}`)
}
//抽奖页面编辑
export const updateLuckyDrawPage = (params) => {
    return http.common.put(`${baseUrl}/luckyDrawPage/update`, params)
}


/******领券中心配置*********/
//领券中心配置列表
export const couponCenterList = (params) => {
    return http.common.post(`${baseUrl}/coupon/center/list`, params)
}
//用户领取列表 
export const couponReceiveList = (params) => {
    console.log(params)
    return http.common.get(`${baseUrl}/coupon/center/user/receive/list`, { params })
}
//领券中心配置开启、关闭
export const switchCouponConfig = (params) => {
    return http.common.delete(`${baseUrl}/coupon/center/switch/${params.couponCenterId}/${params.isEnabled}`)
}
//新增配置 
export const addCouponConfig = (params) => {
    return http.common.post(`${baseUrl}/coupon/center/add`,params)
}
//领券中心单条记录查看
export const getCouponConfigById = (params) => {
    return http.common.get(`${baseUrl}/coupon/center/${params.couponCenterId}`)
}
//领券中心配置编辑 
export const putCouponConfig = (params) => {
    return http.common.put(`${baseUrl}/coupon/center/modify/${params.couponCenterId}`,params)
}
//下载导入模板 
export const downloadTemplate = (params) => {
    return http.common.get(`${baseUrl}/coupon/center/template/download`,{responseType: 'blob'})
}
//批量新增
export const batchAddConponConfig = (params) => {
    return http.common.post(`${baseUrl}/coupon/center/batch/add`,params)
}
//下载失败数据 
export const downloanErrorCouponData = (file) => {
    var fd = new FormData()
    fd.append('file', file)
    return http.common.post(`${baseUrl}/coupon/center/error/download`,fd,{ responseType: 'blob' })
}

