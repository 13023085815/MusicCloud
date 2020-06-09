<template>
  <div>
    <el-table v-loading="loading" :data="blogList" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="content" label="内容"></el-table-column>
      <el-table-column prop="nicName" label="发布人"></el-table-column>
      <el-table-column prop="createTime.$date" label="发布时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 使用分页组件实现分页效果 -->
    <!-- <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :current-page="page"
      :page-size="count"
    ></el-pagination> -->

     <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>你确定删除博客吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList,del } from "@/api/blog.js";
import format from "@/utils/format.js";
import scroll from "@/utils/scroll.js";
export default {
  data() {
    return {
      blogList: [],
      count: 20,
      loading: false,
      dialogVisible:false,
      blog:{},
      // total: 0,
      // page: 0
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // 滚动实现分页。。。
    scroll.start(this.getList)
  },
  methods: {
    getList() {
      this.loading = true;
      fetchList({
        start: this.blogList.length,
        // start: this.count * this.page,
        count: this.count
      })
        .then(res => {
          this.loading = false;
          let data = res.data;
          // this.total = res.total;
          let blogList = [];
          data.forEach(item => {
            item = JSON.parse(item);
            item.createTime.$date = format(item.createTime.$date);
            blogList.push(item);
          });

          // 分页
          // this.blogList = blogList;   

          // 滚动分页实现
          this.blogList = this.blogList.concat(blogList);
          // 没有更多数据了
          if(blogList.length<this.count){
            scroll.end();
            this.$message({
              message:"没有更多数据了",
              type:"info"
            })
          }
        })
        .catch(err => {
          this.loading = false;
          console.log(err);
        });
    },
    onDel(res) {
      this.dialogVisible = true;
      this.blog = res
    },
    doDel(){
      this.dialogVisible = false;
      del(this.blog).then(res=>{
        this.loading = false;
        if(res.data.delBlogRes.deleted>0){
          this.blogList = [];
          this.getList();
          this.$message({
            message:"删除成功",
            type:'success'
          })
        }
      })

    }
  }
};
</script>
<style lang="">
</style>