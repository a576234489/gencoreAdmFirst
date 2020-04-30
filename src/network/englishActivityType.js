import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/englishActivityType/listAll",
    method:'get',
  })
}

export function fetchCreate(data) {
  return request({
    url:"/englishActivityType/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/englishActivityType/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/englishActivityType/delete/"+id,
    method:'get',
  })
}



