import {request} from './request'
import axios from 'axios';

export function fetchGetList(params) {
  return request({
    url:"/findProject/getList",
    method:'get',
    params:params
  })
}

export function fetchCreate(data) {
  return request({
    url:"/findProject/create",
    method:'post',
    data:data
  })
}

export function fetchUpdate(data) {
  return request({
    url:"/findProject/update",
    method:'post',
    data:data
  })
}

export function fetchDelete(id) {
  return request({
    url:"/findProject/delete/"+id,
    method:'get'
  })
}

export function fetchFinancingAlreadyListAll(params) {
  return request({
    url:"/findProject/listAllFinancingAlready",
    method:'get',
    params:params
  })
}

export function fetchFinancingMainBodyListAll(params) {
  return request({
    url:"/findProject/listAllFinancingMainBody",
    method:'get',
    params:params
  })
}

export function fetchFinancingDemandListAll(params) {
  return request({
    url:"/findProject/listAllFinancingDemand",
    method:'get',
    params:params
  })
}

export function fetchProjectTypeListAll(params) {
  return request({
    url:"/findProject/listAllProjectType",
    method:'get',
    params:params
  })
}
export function fetchProvince() {
  return axios({
    url:"http://datavmap-public.oss-cn-hangzhou.aliyuncs.com/areas/csv/100000_province.json",
    method:'get',
  })
}




