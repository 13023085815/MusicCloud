const koa = require('koa');
const app = new koa()
const Router = require('koa-router')
const router = new Router()
const cors = require("koa2-cors")
const ENV = 'tast-4il1z'   // 云环境ID
var koaBody = require('koa-body');  // 接受  form-data  图片文件等... formmidabale  

const playlist = require("./controller/playlist.js");
router.use('/playlist',playlist.routes()) // 将plaulist路由挂到1路由
const swiper = require("./controller/swiper.js");
router.use('/swiper',swiper.routes())
const blog = require("./controller/blog.js");
router.use('/blog',blog.routes())


app.use(koaBody({
    multipart:true
}));

// 全局路由；
app.use(async(ctx,next)=>{
    ctx.state.ENV = ENV;
    await next();
})
app.use(cors({
    origin:['http://localhost:9528'],  // 允许什么地址访问服务
    credentials:true
}))

app.use(router.routes());                 // 将1级路由挂到服务上
app.use(router.allowedMethods());        // 允许访问路由
app.listen(3000,()=>{
    console.log('node is ok');
})
