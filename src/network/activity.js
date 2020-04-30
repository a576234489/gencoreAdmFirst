import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/activity/getList",
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/activity/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/activity/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/activity/delete/"+id,
    method:'get',
  })
}


