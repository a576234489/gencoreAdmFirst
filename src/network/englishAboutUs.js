import {request} from './request'

export function fetchListAll() {
  return request({
    url:"/englishAboutUs/listAll",
    method:'get',
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/englishAboutUs/update",
    method:'post',
    data:data
  })
}



