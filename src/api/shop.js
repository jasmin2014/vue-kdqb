// 商户管理
import http from '../lib/http';
import qs from 'qs';

/**
 *
 * 商户列表 - 获取商户列表
 *
 * @param params
 * {
 *   shopName: '商户名称',
 *   shopCode: '商户编号',
 *   pageNum: '页码',
 *   pageSize: '每页条数'
 * }
 *
 * @returns {object}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *     content: [
 *       {
 *         shopInfoId: '商户id',
 *         shopCode: '商户编号',
 *         shopName: '商户名称',
 *         loginMobile: '关联账号'
 *       },
 *       ...
 *     ],
 *     pageNum: '页码',
 *     pageSize: '每页条数',
 *     total: '总条数',
 *     totalPages: '总页数'
 *   }
 * }
 *
 */
export const getShopList = (params) => http.common.post('/shop/admin/shopInfo/list', params);

/**
 *
 * 商户列表 - 获取商户详情
 *
 * @param params
 * {
 *   shopInfoId: '商户id'
 * }
 *
 * @returns {*}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *   }
 * }
 *
 */
export const getShopDetail = (params) => http.common.post('/shop/admin/shopInfo/detail', qs.stringify(params));

/**
 *
 * 商户列表 - 新增商户
 *
 * @param params
 * {
 *   accId: 'accType===1?身份证号码:社会信用代码',
 *   accMobile: '银行预留手机号',
 *   accName: 'accType===1?姓名:公司名称',
 *   accNo: '银行卡号',
 *   accType: '账户类型 1:个人,2:对公',
 *   branchName: '开户行支行',
 *   cityCode: '开户行所在市code',
 *   cityName: '开户行所在市text',
 *   partyId: '关联账号',
 *   provinceCode: '开户行所在省code',
 *   provinceName: '开户行所在省text',
 *   shopName: '商户名称'
 * }
 *
 * @returns {*}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *   }
 * }
 *
 */
export const createShop = (params) => http.common.post('/shop/admin/shopInfo/createShop', params);

export const getPartyId = (params) => http.common.post('/basic/admin/party/getUserInfoByCellphone', qs.stringify(params));

/**
 *
 * 商户列表 - 新增商户 - 对公支持银行列表
 *
 * @returns {*}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: [
 *     {
 *       bankCode: '银行code',
 *       bankName: '银行名称'
 *     },
 *     ...
 *   ]
 * }
 *
 */
export const getBankList = () => http.common.get('/funds/admin/bankInfo/query');

/**
 *
 * 商户列表 - 更新商户详情
 *
 * @param params
 * {
 *   shopInfoId: '商户id',
 *   accId: 'accType===1?身份证号码:社会信用代码',
 *   accMobile: '银行预留手机号',
 *   accName: 'accType===1?姓名:公司名称',
 *   accNo: '银行卡号',
 *   accType: '账户类型 1:个人,2:对公',
 *   branchName: '开户行支行',
 *   cityCode: '开户行所在市code',
 *   cityName: '开户行所在市text',
 *   loginMobile: '关联账号',
 *   provinceCode: '开户行所在省code',
 *   provinceName: '开户行所在省text',
 *   settleRuleCode: '结算策略',
 *   shopName: '商户名称'
 * }
 *
 * @returns {*}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *   }
 * }
 *
 */
export const updateShop = (params) => http.common.post('/shop/admin/shopInfo/updateShop', params);

/**
 *
 * 订单列表 - 获取订单列表
 *
 * @param params
 * {
 *   platOrderId: '商品订单号',
 *   loanApplyNo: '贷款编号',
 *   shopOrderNo: '商家订单号',
 *   shopName: '所属商家',
 *   orderTitle: '订单名称',
 *   buyPartyName: '买家姓名',
 *   buyMobile: '买家手机号',
 *   orderStatus: '交易状态',
 *   createdTimeStart: '开始时间',
 *   createdTimeEnd: '结束时间',
 *   goodsType: '订单类型',
 *   pageNum: '页码',
 *   pageSize: '每页条数'
 * }
 *
 * @returns {*}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *     content: [
 *       {
 *         orderId: '订单id',
 *         goodsType: '订单类型',
 *         platOrderId: '商品订单号',
 *         loanApplyNo: '贷款编号',
 *         channelName: '渠道',
 *         shopOrderNo: '商家订单号',
 *         shopName: '所属商家',
 *         orderTitle: '订单名称',
 *         orderAmount: '订单金额',
 *         buyPartyName: '买家姓名',
 *         buyMobile: '买家手机号',
 *         createdTime: '创建时间',
 *         orderStatus: '交易状态'
 *       },
 *       ...
 *     ],
 *     pageNum: '页码',
 *     pageSize: '每页条数',
 *     total: '总条数',
 *     totalPages: '总页数'
 *   }
 * }
 *
 */
export const getOrderList = (params) => http.common.post('/shop/admin/order/list', params);


export const exportOrderExcel = (params) => http.common.post('/shop/admin/order/exportShopOrder', params, {responseType: "blob"});


/**
 *
 * 订单列表 - 获取订单列详情
 *
 * @param params
 * {
 *   orderId: '订单id'
 * }
 *
 * @returns {*}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *     shopOrder: {
 *       buyPartyName: '收货人信息 - 收货人姓名',
 *       buyMobile: '收货人信息 - 收货人手机号',
 *       buyAddress: '收货人信息 - 收货人地址',
 *       platOrderId: '订单信息 - 订单编号',
 *       shopName: '订单信息 - 商户',
 *       loginMobile: '订单信息 - 商户账号',
 *       orderStatus: '订单信息 - 订单状态',
 *       createdTime: '订单信息 - 创建时间',
 *       updatedTime: '订单信息 - 最后更新时间',
 *       orderAmount: '商品信息 - 订单总金额',
 *       settleAmount: '商品信息 - 订单总成本价'
 *     },
 *     shopOrderGoodsList: [
 *       {
 *         orderGoodsId:'商品编号',// todo 这个商品编号 目前泰然城那边不会传给我们  那我们只能取orderGoodsId
 *         goodsName:'商品名称',
 *         goodsNum:'商品数量',
 *         goodsAmount:'商品单价'
 *       },
 *       ...
 *     ],
 *     shopOrderOperLogList: [
 *       {
 *         operDate:'时间',
 *         content:'订单节点'
 *       },
 *       ...
 *     ]
 *   }
 * }
 *
 */
export const getOrderDetail = (params) => http.common.post('/shop/admin/order/getOrderDetail', qs.stringify(params));

/**
 *
 * 商户结算 - 获取商户结算列表
 *
 * @param params
 * {
 *   loanApplyNo: '贷款编号',
 *   platOrderId: '商品订单号',
 *   shopName: '商户名称',
 *   transferType: '结算方式',
 *   transferStatus: '结算状态',
 *   platOrderId: '生成开始时间',
 *   createdTimeStart: '生成结束时间',
 *   createdTimeEnd: '生成开始时间',
 *   transferDateStart: '实际结算开始时间',
 *   transferDateEnd: '实际结算结束时间',
 *   pageNum: '页码',
 *   pageSize: '每页条数'
 * }
 *
 * @returns {object}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *     content: [
 *       {
 *         loanApplyId: '贷款编号',
 *         platOrderId: '商品订单号',
 *         createdTime: '生成时间',
 *         shopName: '商户名称',
 *         accNo: '商户银行卡号',
 *         settleAmount: '结算金额',
 *         transferType: '结算方式',
 *         transferStatus: '结算状态',
 *         transferDate: '实际结算时间',
 *         realSettleAmount: '实际结算金额',
 *         orgAccountName: '放款账户',
 *         updatedBy: '操作人'
 *       },
 *       ...
 *     ],
 *     pageNum: '页码',
 *     pageSize: '每页条数',
 *     total: '总条数',
 *     totalPages: '总页数'
 *   }
 * }
 *
 */
export const getSettleList = (params) => http.common.post('/shop/admin/shopSettle/list', params);

export const getAccountAmount = (params) => http.common.get('/funds/admin/account/query', {params});

export const commitSettle = (params) => http.common.post('/shop/admin/shopSettle/commit', params);


export const exportSettleExcel = (params) => http.common.post('/shop/admin/shopSettle/exportShopSettle', params, {responseType: "blob"});

/**
 *
 * 商户结算 - 获取退款退货列表
 *
 * @param params
 * {
 *   returnOrderNo: '退货/售后编号',
 *   shopOrderNo: '订单编号',
 *   loanApplyId: '贷款编号',
 *   applyDate: '发起时间',
 *   sellerOrderNo: '商家订单号',
 *   buyPartyName: '姓名',
 *   buyMobile: '登录账号',
 *   goodsName: '商户名称',
 *   returnStatus: '退货状态',
 *   pageNum: '页码',
 *   pageSize: '每页条数'
 * }
 *
 * @returns {object}
 * {
 *   code: '状态码',
 *   message: '操作信息',
 *   body: {
 *     content: [
 *       {
 *         returnOrderNo: '退货/售后编号',
 *         shopOrderNo: '订单编号',
 *         loanApplyId: '贷款编号',
 *         applyDate: '发起时间',
 *         sellerOrderNo: '商家订单号',
 *         buyPartyName: '姓名',
 *         buyMobile: '登录账号',
 *         goodsName: '商品名称',
 *         orderTitle: '订单名称',
 *         returnStatus: '退货/售后类型',
 *         orderAmount: '订单金额',
 *         returnAmount: '退款金额',
 *         returnStatus: '退货状态'
 *       },
 *       ...
 *     ],
 *     pageNum: '页码',
 *     pageSize: '每页条数',
 *     total: '总条数',
 *     totalPages: '总页数'
 *   }
 * }
 *
 */
export const getReturnList = (params) => http.common.post('/shop/admin/returnOrder/list', params);

export const exportReturnExcel = (params) => http.common.post('/shop/admin/returnOrder/exportReturnOrder', params, {responseType: "blob"});

export const getReturnDetail = (params) => http.common.get('/finance/admin/loanbill/queryRefundDetail', {params});

