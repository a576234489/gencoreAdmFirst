import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/findSpace/listAll",
    method:'get'
  })
}

export function fetchCreate(data) {
  return request({
    url:"/findSpace/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/findSpace/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/findSpace/delete/"+id,
    method:'get',
  })
}