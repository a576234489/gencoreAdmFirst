<template>
  <div class="app-container">
    <el-card>
      <div>
        <i class="el-icon-search"></i>
        <span style="margin-left: 2px">筛选搜索</span>
        <el-button
                style="float: right"
                type="primary"
                size="small"
                @click="handleSearchList()"
        >
          查询搜索
        </el-button>
        <el-button
                style="float: right;margin-right: 15px"
                size="small"
                @click="handleResetSearch()"
        >
          重置
        </el-button>
      </div>
      <div style="margin-top: 15px">
        <el-form :inline="true" :model="listQuery" size="small" label-width="140px">
          <el-form-item label="Banner类型：">
            <el-select v-model="listQuery.modular" placeholder="请选择Banner分类" clearable style="width: 203px">
              <el-option
                      v-for="item in bannerTypeOperates"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
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
        <el-table-column label="Banner类型"  align="center">
          <template slot-scope="scope">{{scope.row.modular|formatModular}}</template>
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
    <div class="pagination-container">
      <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              layout="total, sizes,prev, pager, next,jumper"
              :page-size="listQuery.pageSize"
              :page-sizes="[5,10,15]"
              :current-page.sync="listQuery.pageNum"
              :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="isEdit?'编辑网站banner':'添加网站banner'"
      :visible.sync="dialogAddVisible"
      :append-to-body='true'
      width="40%">
      <el-form :model="netWorkBannerData"
               label-width="180px" size="small"
               ref="newWorkBannerForm"
               :rules="rules"
      >
        <el-form-item label="Banner类型：" prop="modular">
          <el-select v-model="netWorkBannerData.modular" placeholder="请选择Banner分类" clearable style="width: 203px" @change="handleModularChange">
            <el-option
                    v-for="item in bannerTypeOperates"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="轮播图：" prop="imageId">
          <single-upload v-model="netWorkBannerData.imgUrl"
                          style="width: 300px;display: inline-block;margin-left: 10px"
                         @setImageId = "setImageId" @clearImageId="clearImageId"
          >

          </single-upload>
        </el-form-item>
        <el-form-item label="图片链接：">
          <el-input placeholder="请输入图片链接" v-model="netWorkBannerData.link" style="width: 250px" clearable></el-input>
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
    type:1,
    imgUrl:null,
    modular:null,
    link:null
  };
  const defaultListQuery = {
    pageNum:1,
    modular:null,
    pageSize:5,
    type:1
  }
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
        total:null,
        isEdit:false,
        listQuery:JSON.parse(JSON.stringify(defaultListQuery)),
        rules: {
          imageId: [{required: true, message: '请上传网站banner图', trigger: 'blur'}],
          modular: [{required: true, message: '请选择Banner分类', trigger: 'blur'}],
        },
        bannerTypeOperates:[
          {
            label:'首页',
            value:1,
          },
          {
            label:'平台咨询',
            value:2
          },
          {
            label:'行业咨询',
            value:3
          },
          {
            label:'活动咨询',
            value:4
          },
          {
            label:'入驻企业',
            value:5
          },
          {
            label:'关于我们',
            value:6
          },
          {
            label:'问专家',
            value:7
          },
          {
            label:'我要入驻',
            value:8
          },
          {
            label:'企业服务',
            value:9
          },
        ],
      }
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
      handleSizeChange(val){//改变每页显示多少条时触发
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleModularChange(){
        this.$refs['newWorkBannerForm'].clearValidate('modular')
      },
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
      },
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
        fetchListAll(this.listQuery).then(res => {
          this.listLoading = false;
          this.list = res.data.list;
          this.total = res.data.total;
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
    },
    filters:{
      formatModular(val){
        switch (val) {
          case 1:
            return '首页'
          case 2:
            return '平台咨询'
          case 3:
            return '行业咨询'
          case 4:
            return '活动咨询'
          case 5:
            return '入驻企业'
          case 6:
            return '关于我们'
          case 7:
            return '问专家';
          case 8:
            return '我要入驻';
          case 9:
            return '企业服务';
        }
      }
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
