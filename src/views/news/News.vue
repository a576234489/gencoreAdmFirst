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
          <el-form-item label="标题:">
            <el-input style="width: 203px" v-model="listQuery.title" placeholder="标题" clearable></el-input>
          </el-form-item>
          <el-form-item label="新闻类型：">
            <el-select style="width: 203px"  v-model="listQuery.newsTypeId" placeholder="请选择新闻类型" clearable>
              <el-option
                v-for="item in newsTypeOptions"
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
        <el-table-column label="新闻作者" align="center">
          <template slot-scope="scope">{{scope.row.author}}</template>
        </el-table-column>
        <el-table-column label="标题" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="概要" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.outline}}</template>
        </el-table-column>
        <el-table-column label="置顶状态" align="center">
          <template slot-scope="scope">{{scope.row.status|formatStatus}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.createTime|formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">
              编辑
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
      :title="isEdit?'编辑新闻':'添加新闻'"
      :visible.sync="dialogEditVisible"
      :append-to-body='true'
      width="58%">
      <el-form :model="newsData"
               label-width="170px" size="small"
               ref="newsForm"
               :rules="rules"
      >
        <el-form-item label="新闻类型：" prop="newsTypeId">
          <el-select style="width: 598px" v-model="newsData.newsTypeId" placeholder="请选择新闻类型" clearable  @change="handleNewsTypeChange">
            <el-option
              v-for="item in newsTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="作者：" prop="author">
          <el-input placeholder="请输入作者" v-model="newsData.author" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input placeholder="请输入标题" v-model="newsData.title" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="概要：" prop="outline">
          <el-input placeholder="请输入概要" v-model="newsData.outline" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="置顶状态：">
          <el-radio-group v-model="newsData.status" >
            <el-radio :label="0">不置顶</el-radio>
            <el-radio :label="1">置顶</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="新闻缩略图：" prop="imageId">
          <single-upload v-model="newsData.imgUrl" style="width: 300px;display: inline-block;margin-left: 10px"
                         @setImageId = "setImageId" @clearImageId="clearImageId"></single-upload>
        </el-form-item>
        <el-form-item label="新闻内容：" prop="content">
          <Tinymce @tinyClearValidate="tinyClearValidate" v-if="dialogEditVisible" ref="editor" v-model="newsData.content" :height="400" :width="600"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('newsForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll as fetchNewsTypeListAll} from 'network/newsType'
  import {fetchGetList,fetchCreate,fetchUpdate,fetchDelete} from 'network/news'
  let formatDate = require("common/utils");
  import SingleUpload from 'components/Upload/singleUpload'
  import Tinymce from 'components/Tinymce'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    title: null,
    newsTypeId:null,
    type: 1
  };
  const defaultNewsData = {
    id:null,
    author:null,
    title:null,
    outline:null,
    content:null,
    imageId:null,
    status:0,
    newsTypeId:null,
    type:null,
    createTime:null,
    type:1
  }
  export default {
    name: "News",
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        newsData: Object.assign({}, defaultNewsData),
        categoryOptions:[],
        isEdit:false,
        newsTypeOptions:[],
        rules: {
          newsTypeId: [{required: true, message: '请选择新闻类型', trigger: 'blur'}],
          author: [{required: true, message: '请输入作者', trigger: 'blur'}],
          title: [{required: true, message: '请输入标题', trigger: 'blur'}],
          outline: [{required: true, message: '请输入概要', trigger: 'blur'}],
          imageId: [{required: true, message: '请上传新闻缩略图', trigger: 'blur'}],
          content: [{required: true, message: '请输入新闻内容', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getNewsTypeList();
      this.getList()
    },
    methods:{
      getNewsTypeList(){
        fetchNewsTypeListAll().then(res=>{
          this.newsTypeOptions = [];
          let newsTypeList = res.data;
          newsTypeList.forEach(item=>{
            this.newsTypeOptions.push({label:item.name,value:item.id})
          })
        })
      },
      getList(){
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res => {
          this.list = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        })
      },
      handleSizeChange(val){//改变每页显示多少条时触发
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val){
        this.listQuery.pageNum = val;
        this.getList();
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
      },
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleAdd(){
        this.dialogEditVisible = true;
        this.isEdit = false;
        this.newsData = JSON.parse(JSON.stringify(defaultNewsData));
        try{
          this.$refs['newsForm'].clearValidate();
        }catch (e) {

        }
      },
      handleNewsTypeChange(){
        this.$refs['newsForm'].clearValidate('newsTypeId');
        this.$forceUpdate()
      },
      tinyClearValidate(){
        this.$refs['newsForm'].clearValidate('content');
      },
      setImageId(res){
        this.newsData.imageId = res.data.imageId;
        //验证新闻缩略图
        this.$refs['newsForm'].clearValidate('imageId');
      },
      clearImageId(){
        this.newsData.imageId = '';
      },
      handleDialogConfirm(ref){
        this.$refs[ref].validate((valid) => {
          if(valid){
            if(this.newsData.id == null) {
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                fetchCreate(this.newsData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }else{
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                fetchUpdate(this.newsData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }
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
          this.dialogEditVisible = false;
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      handleUpdate(index,row){
        this.dialogEditVisible = true
        this.isEdit = true;
        this.newsData = Object.assign({},row)
        try{
          this.$refs['newsForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该新闻?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          })
        });
      },
    },
    filters:{
      formatCreateTime(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      formatStatus(value){
        if(value == 0){
          return '不置顶';
        }else{
          return '置顶';
        }
      }
    },
    components:{
      SingleUpload,
      Tinymce
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
