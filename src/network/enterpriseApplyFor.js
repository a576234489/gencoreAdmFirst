import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/enterpriseApplyFor/getList",
    method:'get',
    params:params
  })
}


export function fetchUpdateStatus(data) {
  return request({
    url:"/enterpriseApplyFor/updateStatus",
    method:'post',
    data:data
  })
}



