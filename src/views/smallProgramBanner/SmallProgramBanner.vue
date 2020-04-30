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
        <el-table-column label="轮播图"  align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.imgUrl"></template>
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
            :title="isEdit?'编辑小程序banner':'添加小程序banner'"
            :visible.sync="dialogAddVisible"
            :append-to-body='true'
            width="40%">
      <el-form :model="netWorkBannerData"
               label-width="180px" size="small"
               ref="newWorkBannerForm"
               :rules="rules"
      >
        <el-form-item label="轮播图：" prop="imageId">
          <single-upload v-model="netWorkBannerData.imgUrl"
                         style="width: 300px;display: inline-block;margin-left: 10px"
                         @setImageId = "setImageId" @clearImageId="clearImageId"
          >

          </single-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('newWorkBannerForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll,fetchCreate,fetchUpdate,fetchDelete} from 'network/netWorkBanner';
  import SingleUpload from 'components/Upload/singleUpload'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  const defaultNetWorkBannerData={
    id:null,
    imageId:null,
    type:2,
    imgUrl:null
  };
  export default {
    name: "NetWorkBanner",
    created() {
      this.getList();
    },
    data() {
      return {
        list: null,
        listLoading: false,
        dialogAddVisible:false,
        netWorkBannerData:Object.assign({},defaultNetWorkBannerData),
        isEdit:false,
        rules: {
          imageId: [{required: true, message: '请上传网站banner图', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
      setImageId(res){
        this.netWorkBannerData.imageId = res.data.imageId;
        //验证新闻缩略图
        this.$refs['newWorkBannerForm'].clearValidate('imageId');
      },
      clearImageId(){
        this.netWorkBannerData.imageId = '';
      },
      getList() {
        this.listLoading = true;
        fetchListAll({type:2}).then(res => {
          this.listLoading = false;
          this.list = res.data.list;
        });
      },
      handleAdd() {
        this.dialogAddVisible = true;
        this.isEdit = false;
        this.netWorkBannerData = Object.assign({},defaultNetWorkBannerData);
        try{
          this.$refs['newWorkBannerForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref) {
        this.$refs[ref].validate((valid) => {
          if(valid){
            this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.netWorkBannerData.id != null) {
                fetchUpdate(this.netWorkBannerData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                fetchCreate(this.netWorkBannerData).then(res => {
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
        this.netWorkBannerData = Object.assign({},row);
        try{
          this.$refs['newWorkBannerForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该小程序banner图?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
      },
    },
    components:{
      SingleUpload
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
