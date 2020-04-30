import {request} from './request'

export function fetchGetList(params) {
  return request({
    url:"/ask/getList",
    method:'get',
    params:params
  })
}

export function fetchCreatReply(data) {
  return request({
    url:"/ask/reply",
    method:'post',
    data:data
  })
}



