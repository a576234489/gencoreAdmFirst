import {request} from "./request";

export function login(username,password) {
  return request({
    url:'/admin/login',
    method:'post',
    data:{
      username,
      password
    }
  })
}

export function logout() {
  return request({
    url: '/admin/logout',
    method: 'post'
  })
}

export function fetchGetInfo() {
  return request({
    url:'/admin/info',
    method: 'get'
  })
}
