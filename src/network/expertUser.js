import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/expert/getList",
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/expert/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/expert/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/expert/delete/"+id,
    method:'get',
  })
}



