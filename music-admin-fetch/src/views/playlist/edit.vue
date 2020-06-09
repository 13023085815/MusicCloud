<template>
  <div>
    <el-form ref="form" :model="playlist" label-width="80px">
      <el-form-item label="歌单名称">
        <el-input v-model="playlist.name"></el-input>
      </el-form-item>
      <el-form-item label="描述">
        <el-input v-model="playlist.copywriter"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit">更新</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { fethcById, update } from "@/api/playlist.js";
export default {
  data: function() {
    return {
      playlist: {}
    };
  },
  created() {
    fethcById({
      id: this.$route.params.id
    }).then(res => {
      console.log(res);
      this.playlist = res.data;
    });
  },
  methods: {
    onSubmit() {
      update(this.playlist)
        .then(res => {
          console.log(res);
          if (res.data.modified > 0) {
            this.$message({
              message: "更新成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "更新失败",
              type: "warning"
            });
          }

          this.$router.back();
        })
        .catch(err => {
          this.$message({
            message: "更新出错了",
            type: "error"
          });
          this.$router.back();
        });
    },
    onCancel() {
      //  点击取消返回到歌单列表
      this.$router.back();
    }
  }
};
</script>
<style scope>
.edit {
  margin-top: 30px;
}
</style>