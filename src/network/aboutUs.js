import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/aboutUs/listAll",
    method:'get',
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/aboutUs/update",
    method:'post',
    data:data
  })
}



