import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/englishNewsType/listAll",
    method:'get',
  })
}

export function fetchCreate(data) {
  return request({
    url:"/englishNewsType/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/englishNewsType/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/englishNewsType/delete/"+id,
    method:'get',
  })
}



