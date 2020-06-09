import request from '@/utils/request.js'
const baseURL = "http://localhost:3000";

/**
 * 列表展示请求
 */
export function fetchList(){
    return request({
        method:'get',
        url:`${baseURL}/swiper/list`,        
    })
}

export function del(params){
    return request({
        method:'get',
        url:`${baseURL}/swiper/del`,
        params,
    })
}