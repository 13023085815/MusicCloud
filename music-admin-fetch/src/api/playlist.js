/**
 * 这里的代码负责与 歌单管理  有关的请求；只负责http 请求 ；不负责结果的处理
 * 把结果抛出去。交给需要结果的方法处理
 */
// 基于axios 二次封装的一个插件
import request from '@/utils/request.js'
const baseURL = "http://localhost:3000";

/**
 * 方法作用： 请求中控服务器 获取歌单列表
 * @param {*} params  类型options 对象 接收请求参数
 * 返回promise 对象
 */
export function fetchList(params) {
    //   request 作用发送请求  参数是对象
    //   对象中 url 请求地址  method 请求方法  options对象 请求参数
    return request({
        url: `${baseURL}/playlist/list`,// 请求路径
        params,// 请求参数
        method: 'get' // 请求方法
    })
}

/**
 * 通过id 获取 歌单对象
 * @param {*} params 
 */

export function fethcById(params){
    return request({
        url:`${baseURL}/playlist/getById`,
        params,
        method:'get'
    })
}

/**
 * 更新歌单数据 
 * @param {*} params 
 */
export function update(data){
    return request({
        method:'post',
        url:`${baseURL}/playlist/updatePlaylist`,
        data,
    })
}

export function del(params){
    return request({
        method:'get',
        url:`${baseURL}/playlist/del`,
        params,
    })
}