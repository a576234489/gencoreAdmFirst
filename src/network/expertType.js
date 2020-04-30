import {request} from './request'

export function fetchListAll(params) {
  return request({
    url:"/askType/listAll",
    method:'get',
    params:params
  })
}




