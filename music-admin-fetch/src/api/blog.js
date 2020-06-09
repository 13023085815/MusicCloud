import request from '@/utils/request.js'
const baseURL = "http://localhost:3000";

/**
 * 博客列表展示请求
 * 分页展示
 */
export function fetchList(params){
    return request({
        method:'get',
        url:`${baseURL}/blog/list`,    
        params:{
            ...params
        }    
    })
}

export function del(data){
    return request({
        method:'post',
        url:`${baseURL}/blog/del`,    
        data:{
            ...data
        }    
    })
}
