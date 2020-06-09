<template>
  <div v-loading="loading">
    <div class="filter-container">
      <el-upload
        class="upload-demo"
        action="http://localhost:3000/swiper/upload"
        :on-success="uploadSuccess"
        :show-file-list="false"
        :on-progress="progress"
      >
        <el-button type="primary" size="small">上传图片</el-button>
      </el-upload>
    </div>
    <el-table :data="swiperList" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="图片" width="400">
        <template slot-scope="scope">
          <img :src="scope.row.download_url" alt height="50" />
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="danger" size="mini" @click="onDel(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <span>你确定删除图片吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doDel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { fetchList, del } from "@/api/swiper.js";
export default {
  created() {
    this.getList();
  },
  data() {
    return {
      swiperList: [],
      loading: false,
      dialogVisible: false,
      swiper: {}
    };
  },
  methods: {
    //  获取轮播图列表
    getList() {
      this.loading = true;
      fetchList()
        .then(res => {
          this.loading = false;
          this.swiperList = res.data;
        })
        .catch(err => {
          this.loading = false;
        });
    },
    progress() {
      this.loading = true
    },

    // 图片上传到中控服务器成功后执行
    uploadSuccess(res) {
      console.log(res);
      this.loading = false;
      if (res.id_list.length > 0) {
        this.$message({
          message: "上传图片成功",
          type: "success"
        });
        this.getList();
      }
    },

    onDel(res) {
      this.dialogVisible = true;
      this.swiper = res;
    },
    doDel() {
      this.loading = true;
      this.dialogVisible = false;
      del(this.swiper)
        .then(res => {
          this.loading = false;
          this.getList();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        })
        .catch(err => {
          this.loading = false;
          this.dialogVisible = false;
          this.$message({
            message: "删除出错了",
            type: "error"
          });
        });
    }
  }
};
</script>
<style scope>
.filter-container {
  margin-top: 30px;
  margin-bottom: 10px;
  margin-left: 10px;
}
</style>