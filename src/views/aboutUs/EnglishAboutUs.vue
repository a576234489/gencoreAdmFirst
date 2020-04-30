<template>
  <div class="app-container">
    <el-card shadow="never" class="operate-container">
      <i class="el-icon-tickets"></i>
      <span>数据列表</span>
    </el-card>
    <div class="table-container">
      <el-table
              :data="list"
              style="width: 100%;"
              v-loading="listLoading" border
      >
        <el-table-column label="编号" width="100" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="公司名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>
        <el-table-column label="联系人" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.contacts}}</template>
        </el-table-column>
        <el-table-column label="电话" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.tel}}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.email}}</template>
        </el-table-column>
        <el-table-column label="详细地址" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="地图坐标点" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.location}}</template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleUpdate(scope.$index, scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog
            :title="isEdit?'编辑关于我们':'添加活动分类'"
            :visible.sync="dialogAddVisible"
            :append-to-body='true'
            width="58%">
      <el-form :model="aboutUsData"
               label-width="150px" size="small"
               ref="aboutUsForm"
               :rules="rules"
      >
        <el-form-item label="背景：" prop="background">
          <el-input
                  style="width: 598px;"
                  :autoSize="true"
                  v-model="aboutUsData.background"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入背景"></el-input>
        </el-form-item>
        <el-form-item label="简介：" prop="introduction">
          <el-input
                  style="width: 598px;"
                  :autoSize="true"
                  v-model="aboutUsData.introduction"
                  type="textarea"
                  :rows="5"
                  placeholder="请输入简介"></el-input>
        </el-form-item>
        <el-form-item label="优势与特色：" prop="advantage">
          <el-input
                  style="width: 598px;"
                  :autoSize="true"
                  :rows="5"
                  v-model="aboutUsData.advantage"
                  type="textarea"
                  placeholder="请输入优势与特色"></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="companyName">
          <el-input placeholder="请输入公司名称" v-model="aboutUsData.companyName" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="图片：" prop="imageUrlsArray" @multiClearValidate="multiClearValidate">
          <multi-upload v-model="aboutUsData.imageUrlsArray"></multi-upload>
        </el-form-item>
        <el-form-item label="联系人：" prop="contacts">
          <el-input placeholder="请输入联系人" v-model="aboutUsData.contacts" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话：" prop="tel">
          <el-input placeholder="请输入电话" v-model="aboutUsData.tel" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="邮箱：" prop="email">
          <el-input placeholder="请输入邮箱" v-model="aboutUsData.email" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input placeholder="请输入详细地址" v-model="aboutUsData.address" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="地图上坐标点：" prop="location">
          <el-input placeholder="请输入地图坐标点" v-model="aboutUsData.location" style="width: 598px" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('aboutUsForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll,fetchUpdate} from 'network/englishAboutUs';
  import MultiUpload from '@/components/Upload/multiUpload'
  import {validatePhoneTwo,validateEMail} from 'common/validate'
  const defaultAboutUsData={
    id:null,
    background:null,
    introduction:null,
    advantage:null,
    companyName:null,
    contacts:null,
    tel:null,
    email:null,
    address:null,
    location:null,
    carouselImageUrl:null,
    createTime:null,
    imageUrlsArray:[]
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
        aboutUsData:Object.assign({},defaultAboutUsData),
        isEdit:false,
        rules: {
          background: [{required: true, message: '请输入背景', trigger: 'blur'}],
          introduction: [{required: true, message: '请输入简介', trigger: 'blur'}],
          advantage: [{required: true, message: '请输入优势与特色', trigger: 'blur'}],
          companyName: [{required: true, message: '请输入公司与名称', trigger: 'blur'}],
          imageUrlsArray: [{required: true, message: '请上传图片', trigger: 'blur'}],
          contacts: [{required: true, message: '请输入联系人', trigger: 'blur'}],
          tel: [
            {required: true, message: '请输入手机号码或者固话', trigger: 'blur'},
            {validator: validatePhoneTwo, message: "手机号码或者固话格式不正确", trigger: 'blur'}
          ],
          email: [
            {required: true, message: '请输入邮箱', trigger: 'blur'},
            {validator: validateEMail, message: "邮箱格式不正确", trigger: 'blur'}
          ],
          address: [{required: true, message: '请输入详细地址', trigger: 'blur'}],
          location: [{required: true, message: '请输入坐标点', trigger: 'blur'}],
        },
      }
    },
    methods:{
      getList() {
        this.listLoading = true;
        fetchListAll().then(res => {
          this.listLoading = false;
          this.list = res.data;
        });
      },
      handleDialogConfirm(ref) {
        this.$refs[ref].validate((valid) => {
          if(valid){
            this.$confirm('是否要确认?', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              if (this.aboutUsData.id != null) {
                this.aboutUsData.carouselImageUrl = this.aboutUsData.imageUrlsArray.join(',');
                fetchUpdate(this.aboutUsData).then(res => {
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
      multiClearValidate(){
        //验证新闻缩略图
        this.$refs['aboutUsForm'].clearValidate('imageUrlsArray');
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
        this.aboutUsData = Object.assign({},row);
        if(this.aboutUsData.carouselImageUrl != null && this.aboutUsData.carouselImageUrl != ''){
          this.$set(this.aboutUsData,'imageUrlsArray',this.aboutUsData.carouselImageUrl.split(','))
        }else{
          this.$set(this.aboutUsData,'imageUrlsArray',[])
        }
        try{
          this.$refs['aboutUsForm'].clearValidate();
        }catch (e) {

        }
      },
    },
    components:{
      MultiUpload,
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
