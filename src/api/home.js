// 设备管理
import request from '@/utils/request'
import qs from 'qs'

// 登录
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}
// 场景列表
export function listAllCompanyScene(data) {
  return request({
    url: 'companyInfo/listAllCompanyScene',
    method: 'post',
    data:qs.stringify(data)
  })
}
// 素有公司
export function getCompanyScene(data) {
    return request({
        url: '/companyInfo/getCompanyScene',
        method: 'post',
        data:qs.stringify(data)
    })
}
// 企查查企业详情
export function industryDetail(data) {
  return request({
    url: '/qichacha/industryDetail',
    method: 'post',
    data:qs.stringify(data)
  })
}
// 企查查专利
export function getPatentCount(data) {
  return request({
    url: '/qichacha/getPatentCount',
    method: 'post',
    data: qs.stringify(data)
  })
}

