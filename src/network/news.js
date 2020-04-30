import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/news/getList",
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/news/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/news/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/news/delete/"+id,
    method:'get',
  })
}


