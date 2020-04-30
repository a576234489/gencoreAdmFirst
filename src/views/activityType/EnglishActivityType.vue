<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
      <el-button size="mini" class="btn-add" @click="handleAdd()">添加</el-button>
    </el-card>
    <div class="table-container">
      <el-table
              :data="list"
              style="width: 100%;"
              v-loading="listLoading" border
      >
        <el-table-column label="编号" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="类型名称" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
            :title="isEdit?'编辑活动分类':'添加活动分类'"
            :visible.sync="dialogAddVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="ActivityTypeData"
               label-width="208px" size="small"
               :rules="rules"
               ref="activityTypeForm"
      >
        <el-form-item label="类型名称：" prop="name">
          <el-input v-model="ActivityTypeData.name" style="width: 250px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('activityTypeForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll,fetchCreate,fetchUpdate,fetchDelete} from 'network/englishActivityType';
  import {columnSortMixin,commonMixin} from 'common/mixin'
  const defaultActivityTypeData={
    name:null,
  };
  export default {
    name: "ActivityType",
    created() {
      this.getList();
    },
    data() {
      return {
        list: null,
        listLoading: false,
        dialogAddVisible:false,
        ActivityTypeData:Object.assign({},defaultActivityTypeData),
        isEdit:false,
        rules: {
          name: [{required: true, message: '请输入活动类型名称', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
      getList() {
        this.listLoading = true;
        fetchListAll().then(res => {
          this.listLoading = false;
          this.list = res.data;
        });
      },
      handleAdd() {
        this.dialogAddVisible = true;
        this.isEdit = false;
        this.ActivityTypeData = Object.assign({},defaultActivityTypeData);
        try{
          this.$refs['activityTypeForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref) {
        this.$refs[ref].validate((valid) => {
          if (valid) {
            this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.ActivityTypeData.id != null) {
                fetchUpdate(this.ActivityTypeData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                fetchCreate(this.ActivityTypeData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              }
            })
          }else{
            this.$message({
              message: '验证失败',
              type: 'error',
              duration: 1000
            });
          }
        })
      },
      handleDialogConfirmResult(res){
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: 'success',
          });
          this.dialogAddVisible = false;
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      handleUpdate(index,row){
        this.dialogAddVisible = true;
        this.isEdit = true;
        this.ActivityTypeData = Object.assign({},row);
        try{
          this.$refs['activityTypeForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该资源分类?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
      },
    }
  }
</script>

<style scoped>
  .app-container {
    padding: 25px;
  }
  .operate-container{
    margin-top: 20px;
  }
  .operate-container .btn-add{
    float: right;
  }
  .pagination-container {
    display: inline-block;
    float: right;
    margin-top: 20px;
  }
</style>
