const getAccessToken = require('../untils/getAccessToken.js')
const rp = require("request-promise")
const fs = require("fs")


const cloudStorage = {
    /**
     * 从云存储中下载文件
     * @param {*} ctx 
     * @param {*} file_list  文件列表集合  数组[(fileid,max_age:7200)]
     */
    async download(ctx,file_list){
        const ACCESS_TOKEN = await getAccessToken();
        const optios = {
            method:'post',
            url:`https://api.weixin.qq.com/tcb/batchdownloadfile?access_token=${ACCESS_TOKEN}`,
            body:{
                "env": ctx.state.ENV,
                "file_list":file_list
            },
            json:true
        };
        return await rp(optios).then((res)=>{
            return res
        }).catch((err)=>{
            console.log(err);
            return err
        })
    },

    /**
     * 将文件上传到云存储中
     * @param {*} ctx  上下文对象
     * 思路：先获取请求参数 在上传到云存储
     */
    async upload(ctx){
        // 1：获取请求参数
        const ACCESS_TOKEN = await getAccessToken();
        const file = ctx.request.files.file      // 获取去文件对象
        const path = `swiper/${Date.now()}-${Math.random()}-${file.name}`;
        const options = {
            method:'post',
            url:`https://api.weixin.qq.com/tcb/uploadfile?access_token=${ACCESS_TOKEN}`,
            body:{
                "env":ctx.state.ENV,
                path,
            },
            json:true
        }
        // 请求参数
        const info =  await rp(options).then((res)=>{
            return res
        }).catch((err)=>{
            console.log(err)
            return err
        })

        // 2：上传图片  ----> 按照官方官方文档说明
        const params = {
            method:'post',
            headers:{
                "content-type":"multipart/form-data",
            },
            url:info.url,
            formData:{
                key:path,
                Signature:info.authorization,
                "x-cos-security-token":info.token,
                "x-cos-meta-fileid":info.cos_file_id,
                file:fs.createReadStream(file.path),   // 二进制文件路径
            },
            json:true,
        }
        await rp(params)
        return info.file_id
    },

    /**
     * 删除云存储中文件
     * @param {*} ctx         上下文对象
     * @param {*} fileid_list fileid集合 数据
     */
    async delete(ctx,fileid_list){
        const ACCESS_TOKEN = await getAccessToken();
        const options= {
            method:'post',
            url:`https://api.weixin.qq.com/tcb/batchdeletefile?access_token=${ACCESS_TOKEN}`,
            body:{
                env:ctx.state.ENV,
                fileid_list:fileid_list,
            },
            json:true
        }

       return await rp(options).then(res=>res).catch(err=>err)
    }
}

module.exports = cloudStorage