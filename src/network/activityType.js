import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/activityType/listAll",
    method:'get',
  })
}

export function fetchCreate(data) {
  return request({
    url:"/activityType/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/activityType/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/activityType/delete/"+id,
    method:'get',
  })
}



