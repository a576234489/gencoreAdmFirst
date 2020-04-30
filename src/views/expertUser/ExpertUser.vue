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
        <el-table-column label="姓名" align="center">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
        <el-table-column label="专家头像" align="center">
          <template slot-scope="scope"><img style="height: 80px" :src="scope.row.imageUrl"></template>
        </el-table-column>
        <el-table-column label="毕业学校" align="center">
          <template slot-scope="scope">{{scope.row.school}}</template>
        </el-table-column>
        <el-table-column label="添加日期" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.createTime|formatCreateTime}}</template>
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
      :title="isEdit?'编辑专家':'添加专家'"
      :visible.sync="dialogAddVisible"
      :append-to-body='true'
      width="58%">
      <el-form :model="expertData"
               label-width="170px" size="small"
               ref="expertUserForm"
               :rules="rules"
      >
        <el-form-item label="账号：" prop="customUser.username">
          <el-input placeholder="请输入账号名" :disabled="isEdit" v-model="expertData.customUser.username" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="姓名：" prop="name">
          <el-input placeholder="请输入姓名" v-model="expertData.name" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="头像：" prop="imageId">
          <single-upload v-model="expertData.imageUrl"
                         style="width: 300px;display: inline-block;margin-left: 10px"
                         @setImageId = "setImageId" @clearImageId="clearImageId"
          ></single-upload>
        </el-form-item>
        <el-form-item label="毕业学校：" prop="school">
          <el-input placeholder="请输入毕业学校" v-model="expertData.school" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="擅长领域：">
          <el-col :span="4" v-for="resource in askTypeList" :key="resource.id" style="padding: 4px 0">
            <el-checkbox v-model="resource.checked" @change="handleCheckChange(resource)">
              {{resource.name}}
            </el-checkbox>
          </el-col>
        </el-form-item>
        <el-form-item label="简介：" prop="synopsis">
          <el-input
            style="width: 598px;"
            :autoSize="true"
            v-model="expertData.synopsis"
            type="textarea"
            :rows="5"
            placeholder="请输入简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('expertUserForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchCreate,fetchUpdate,fetchDelete} from 'network/expertUser';
  import {fetchListAll as fetchAskTypeListAll} from 'network/expertType';
  import SingleUpload from 'components/Upload/singleUpload'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  import {validatePhone} from 'common/validate'
  let formatDate = require("common/utils");
  const defaultExpertData={
    id:null,
    userId:null,
    name:null,
    imageId:null,
    imageUrl:null,
    school:null,
    synopsis:null,
    createTime:null,
    updateTime:null,
    askTypes:[],
    customUser:{
      id:null,
      username:null
    },
    username:null
  };
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
  };
  export default {
    name: "ExpertUser",
    created() {
      this.getList();
      this.getAskTypeListAll();
    },
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        listLoading: false,
        total:null,
        dialogAddVisible:false,
        expertData:Object.assign({},defaultExpertData),
        isEdit:false,
        askTypeList:[],
        rules: {
          'customUser.username': [
            {required: true, message: '请输入账号', trigger: 'blur'},
            { validator: validatePhone, message: "请输入合法的手机号码", trigger: 'blur'}
          ],
          name: [{required: true, message: '请输入姓名', trigger: 'blur'}],
          imageId: [{required: true, message: '请上传头像', trigger: 'blur'}],
          school: [{required: true, message: '请输入毕业学校', trigger: 'blur'}],
          synopsis: [{required: true, message: '请输入简介', trigger: 'blur'}],
        },
      }
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
      getList() {
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res => {
          this.list = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        });
      },
      getAskTypeListAll(){
        fetchAskTypeListAll({type:1}).then(res => {
          this.askTypeList = res.data;
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
      handleAdd() {
        this.dialogAddVisible = true;
        this.isEdit = false;
        this.expertData = Object.assign({},defaultExpertData);
        this.expertData.customUser.username = null;
        this.askTypeList.forEach(item => {
          item.checked = false;
        })
        try{
          this.$refs['expertUserForm'].clearValidate();
        }catch (e) {

        }
      },
      handleDialogConfirm(ref) {
        this.$refs[ref].validate((valid) => {
          if (valid){
            this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.expertData.id != null) {
                fetchUpdate(this.expertData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                this.expertData.username = this.expertData.customUser.username;
                fetchCreate(this.expertData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              }
            })
          } else{
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
        this.askTypeList.forEach(item => {
          item.checked = false;
        })
        this.expertData = Object.assign({},row);
        this.expertData.askTypes.forEach(item => {
          this.askTypeList.forEach (item2 => {
            if(item.id == item2.id){
              item2.checked = true;
            }
          })
        })
        try{
          this.$refs['expertUserForm'].clearValidate();
        }catch (e) {

        }
        this.$forceUpdate();
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该专家?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
      },
      setImageId(res){
        this.expertData.imageId = res.data.imageId;
        //验证新闻缩略图
        this.$refs['expertUserForm'].clearValidate('imageId');
      },
      clearImageId(){
        this.expertData.imageId = '';
      },
      handleCheckChange(resource) {
        if(resource.checked){
          this.expertData.askTypes.push(resource)
        }else{
          this.expertData.askTypes = this.expertData.askTypes.filter(item =>{
            return item.id != resource.id;
          })
        }
        this.$forceUpdate();
      },
    },
    filters: {
      formatCreateTime(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
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
