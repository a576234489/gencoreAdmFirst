import axios from 'axios';
import {getToken} from 'common/auth'
import store from '../store'

export function request(config) {
  const instant = axios.create({
    //baseURL:'http://localhost:8111',
    baseURL:'http://120.78.207.225:8111',
    timeout:50000
  })
  instant.interceptors.request.use(config=>{
    console.log(store.getters.token)
    if(store.getters.token){
      config.headers['Authorization'] = getToken();
    }
    return config;
  },err=>{
    console.log(err)
  })
  instant.interceptors.response.use(res=>{
    return res.data;
  },err=>{
    console.log(err);
  })
  return instant(config)
}

