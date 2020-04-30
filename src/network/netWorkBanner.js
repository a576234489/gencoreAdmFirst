import {request} from './request'

export function fetchListAll(params) {
  return request({
    url:"/netWorkBanner/listAll",
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/netWorkBanner/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/netWorkBanner/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/netWorkBanner/delete/"+id,
    method:'get',
  })
}



