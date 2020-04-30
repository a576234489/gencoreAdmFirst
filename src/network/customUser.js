import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/customUser/getList",
    method:'get',
    params:params
  })
}




