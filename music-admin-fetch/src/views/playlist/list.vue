<template>
  <div>
    <el-table v-loading="loading" :data="playlist" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="封面" width="100">
        <!-- 凡是需要在表格中插入其他标签的；都可以通过 slot-scope="scope" 获取到表格中数据局 row column -->
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt height="50" />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="copywriter" label="描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="onEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>你确定删除歌单吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
// 跨域烂面
// http:www.a.com  ---> http://www.b.com              // 域名不同
// http:wwww.a.com:9580---->http://www.b.com:3000;    // 端口号不同
// http:wwww.a.com ------>http:www.childa.com 子域名   // 子域名请求
// http:wwww.a.com------->https://www.a.com           // 协议不同

import { fetchList, del } from "@/api/playlist.js";
import scroll from "@/utils/scroll.js";

export default {
  data: function() {
    return {
      playlist: [], // 表格中数据 歌单列表
      count: 15, // 页面中数据的数量
      loading: false, // 控制loading是否显示
      dialogVisible: false,
      info: {}
    };
  },
  created() {
    this.getList();
  },
  mounted() {
    // 需求2：实现滚动加载更多
    scroll.start(this.getList);
  },
  methods: {
    // 获取歌单列表列表
    getList() {
      this.loading = true;
      // 通过发送http请求 中控服务器，获取歌单列表
      fetchList({
        start: this.playlist.length,
        count: this.count
      })
        .then(res => {
          this.loading = false;
          this.playlist = this.playlist.concat(res.data);
          if (res.data.length < this.count) {
            // 没有跟多数据了，到底了
            scroll.end();
            this.$message({
              message: "没有跟多数据了",
              type: "info"
            });
          }
        })
        .catch(err => {
          console.log(err);
          this.loading = false;
          this.$message({
            message: "获取歌单列表失败了",
            type: "warning"
          });
        });
    },
    onEdit(res) {
      // 带着歌单id 跳转到编辑页面
      this.$router.push(`/playlist/edit/${res._id}`);
    },
    onDel(res) {
      // res._id;
      this.dialogVisible = true;
      this.info.id = res._id;
    },
    doDel() {
      this.dialogVisible = false;
      del({ id: this.info.id })
        .then(res => {
          this.playlist = [];
          this.getList();
          if (res.data.deleted > 0) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "删除失败",
              type: "warning"
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "删除的时候，出错了",
            type: "error"
          });
        });
    }
  }
};
</script>
<style lang="">
</style>