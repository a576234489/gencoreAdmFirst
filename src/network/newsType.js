import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/newsType/listAll",
    method:'get',
  })
}

export function fetchCreate(data) {
  return request({
    url:"/newsType/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/newsType/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/newsType/delete/"+id,
    method:'get',
  })
}



