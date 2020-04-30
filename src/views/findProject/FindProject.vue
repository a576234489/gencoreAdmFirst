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
        <el-table-column label="项目名称" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.projectName}}</template>
        </el-table-column>
        <el-table-column label="项目地点" align="center">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="融资主体" align="center" prop="financingMainBody.mainBodyName">
        </el-table-column>
        <el-table-column label="已融资轮次" align="center" prop="financingAlready.alreadyName">
        </el-table-column>
        <el-table-column label="融资需求" align="center" prop="financingDemand.demandName">
        </el-table-column>
        <el-table-column label="发布时间" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.publishTime|formatCreateTime}}</template>
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
      :title="isEdit?'编辑项目':'添加项目'"
      :visible.sync="dialogAddVisible"
      :append-to-body='true'
      width="58%">
      <el-form :model="projectData"
               label-width="170px" size="small"
               ref="findProjectForm"
               :rules="rules"
      >
        <el-form-item label="项目名称：" prop="projectName">
          <el-input placeholder="请输入项目名称" place v-model="projectData.projectName" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司成立时间：" prop="projectCompanyInfo.establishTime">
          <el-date-picker
            class="input-width"
            v-model="projectData.projectCompanyInfo.establishTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="项目地点：" prop="address">
          <el-select style="width: 598px" v-model="projectData.address" placeholder="请选择项目地点" clearable  @change="handleChange('address')">
            <el-option
              v-for="item in provinceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目分类：" prop="projectTypeId">
          <el-select style="width: 598px" v-model="projectData.projectTypeId" placeholder="请选择项目分类" clearable  @change="handleChange('projectTypeId')">
            <el-option
              v-for="item in projectTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="融资主体：" prop="financingMainBodyId">
          <el-select style="width: 598px" v-model="projectData.financingMainBodyId" placeholder="请选择融资主体" clearable  @change="handleChange('financingMainBodyId')">
            <el-option
              v-for="item in financingMainBodyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="融资需求：" prop="financingDemandId">
          <el-select style="width: 598px" v-model="projectData.financingDemandId" placeholder="请选择融资需求" clearable  @change="handleChange('financingDemandId')">
            <el-option
              v-for="item in financingDemandOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="以融轮次：" prop="financingAlreadyId">
          <el-select style="width: 598px" v-model="projectData.financingAlreadyId" placeholder="请选择以融轮次" clearable  @change="handleChange('financingAlreadyId')">
            <el-option
              v-for="item in financingAlreadyOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="列表展示图：" prop="imageUrl">
          <single-upload v-model="projectData.imageUrl" style="width: 300px;display: inline-block;margin-left: 10px" @singleClearValidate="singleClearValidate"
                         ></single-upload>
        </el-form-item>
        <el-form-item label="融资金额：" prop="financingAmount">
          <el-input placeholder="请输入融资金额" v-model="projectData.financingAmount" style="width: 598px" clearable></el-input><span style="margin-left: 15px;color: red">(单位：万元)</span>
        </el-form-item>
        <el-form-item label="占股比例：" prop="proportion">
          <el-input placeholder="请输入占股比例" v-model="projectData.proportion" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="最短退出年限：" prop="shortestTime">
          <el-input placeholder="请输入最短退出年限" v-model="projectData.shortestTime" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="融资方式：" prop="financingWay">
          <el-input placeholder="请输入融资方式" v-model="projectData.financingWay" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="投资退出方式：" prop="exitWay">
          <el-input placeholder="请输入投资退出方式" v-model="projectData.exitWay" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="公司名称：" prop="projectCompanyInfo.companyName">
          <el-input placeholder="请输入公司名称" v-model="projectData.projectCompanyInfo.companyName" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人：" prop="contacts">
          <el-input placeholder="请输入联系人" v-model="projectData.contacts" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话：" prop="telphone">
          <el-input placeholder="请输入联系电话" v-model="projectData.telphone" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="QQ号：" prop="projectCompanyInfo.qqNumber">
          <el-input placeholder="请输入QQ号" v-model="projectData.projectCompanyInfo.qqNumber" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="微信号：" prop="projectCompanyInfo.wxNumber">
          <el-input placeholder="请输入微信号" v-model="projectData.projectCompanyInfo.wxNumber" style="width: 598px" clearable></el-input>
        </el-form-item>

        <el-form-item label="主要成员：">
          <div v-for="(item,index) in projectData.projectCompanyPeoples" style="margin-top: 5px">
            <el-card shadow="never" class="cardBg">
              <span>头像:</span>
              <single-upload v-model="item.imgUrl" style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
              <div>
                <span>名字:</span>
                <el-input placeholder="请输入名字" v-model="item.name" style="width: 300px;margin-left: 10px" clearable></el-input>
              </div>
              <div style="margin-top: 10px">
                <span>简介:</span>
                <el-input
                  style="width: 300px;margin-left: 10px"
                  :autoSize="true"
                  v-model="item.personalProfile"
                  type="textarea"
                  placeholder="请输入个人简介"></el-input>
              </div>
              <el-button style="margin-left: 295px;margin-top: 10px" @click.prevent="removePeople(index)">删除</el-button>
            </el-card>

          </div>
        </el-form-item>
        <el-form-item>
          <el-button size="small" type="primary" @click="handleAddCompanyPeople()">新增</el-button>
        </el-form-item>


        <el-form-item label="项目优势：" prop="advantage">
          <Tinymce @tinyClearValidate="tinyClearValidate" v-if="dialogAddVisible" ref="editor" v-model="projectData.advantage" :height="400" :width="600"/>
        </el-form-item>
        <el-form-item label="项目进展：" prop="progress">
          <el-input
            style="width: 598px;"
            :autoSize="true"
            v-model="projectData.progress"
            type="textarea"
            :rows="5"
            placeholder="请输入项目进展"></el-input>
        </el-form-item>
        <el-form-item label="融资计划：" prop="financingPlan">
          <el-input
            style="width: 598px;"
            :rows="5"
            :autoSize="true"
            v-model="projectData.financingPlan"
            type="textarea"
            placeholder="请输入融资计划"></el-input>
        </el-form-item>
        <el-form-item label="合作需求：" prop="cooperationDemand">
          <el-input
            style="width: 598px;"
            :rows="5"
            :autoSize="true"
            v-model="projectData.cooperationDemand"
            type="textarea"
            placeholder="请输入合作需求"></el-input>
        </el-form-item>
        <el-form-item label="公司简介：" prop="projectCompanyInfo.companySynopsis">
          <el-input
            style="width: 598px;"
            :rows="5"
            :autoSize="true"
            v-model="projectData.projectCompanyInfo.companySynopsis"
            type="textarea"
            placeholder="请输入公司简介"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogAddVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('findProjectForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchGetList,fetchFinancingAlreadyListAll,fetchFinancingMainBodyListAll,fetchFinancingDemandListAll,fetchProjectTypeListAll,fetchProvince,fetchCreate,fetchUpdate,fetchDelete} from 'network/project';
  import SingleUpload from 'components/Upload/singleUpload'
  import Tinymce from 'components/Tinymce'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  import {validateEMail,validatePhoneTwo} from 'common/validate'
  let formatDate = require("common/utils");
  const defaultProjectData={
    id:null,
    projectName:null,
    publishTime:null,
    imageUrl:null,
    address:null,
    projectTypeId:null,
    financingAlreadyId:null,
    financingDemandId:null,
    financingAmount:null,
    financingMainBodyId:null,
    advantage:null,
    progress:null,
    proportion:null,
    shortestTime:null,
    financingWay:null,
    exitWay:null,
    financingPlan:null,
    cooperationDemand:null,
    contacts:null,//联系人
    telphone:null,//联系电话
    type:1,
    projectType:{},
    financingAlready:{},
    financingDemand:{},
    financingMainBody:{},
    projectCompanyInfo:{
      type:1
    },
    projectCompanyPeoples:[],

  };
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    type:1
  };
  export default {
    name: "FindProject",
    created() {
      this.getList();
      this.initFinancingAlreadyOptions();
      this.initFinancingMainBodyOptions();
      this.initFinancingDemandOptions();
      this.initProjectTypeOptions();
      this.initProvince();
    },
    mixins: [columnSortMixin,commonMixin],
    data() {
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        listLoading: false,
        total:null,
        dialogAddVisible:false,
        projectData:Object.assign({},defaultProjectData),
        isEdit:false,
        financingAlreadyOptions:[],
        financingMainBodyOptions:[],
        financingDemandOptions:[],
        projectTypeOptions:[],
        provinceOptions:[],
        rules: {
          projectName: [{required: true, message: '请输入项目名称', trigger: 'blur'}],
          'projectCompanyInfo.establishTime': [{required: true, message: '请选择公司成立时间', trigger: 'blur'}],
          address: [{required: true, message: '请选择项目地点', trigger: 'blur'}],
          projectTypeId: [{required: true, message: '请选择项目分类', trigger: 'blur'}],
          financingMainBodyId: [{required: true, message: '请选择融资主体', trigger: 'blur'}],
          financingDemandId: [{required: true, message: '请选择融资需求', trigger: 'blur'}],
          financingAlreadyId: [{required: true, message: '请选择已融轮次', trigger: 'blur'}],
          imageUrl: [{required: true, message: '请上传列表展示图', trigger: 'blur'}],
          financingAmount: [{required: true, message: '请输入融资金额', trigger: 'blur'}],
          proportion: [{required: true, message: '请输入占股比例', trigger: 'blur'}],
          shortestTime: [{required: true, message: '请输入最短退出年限', trigger: 'blur'}],
          financingWay: [{required: true, message: '请输入融资方式', trigger: 'blur'}],
          exitWay: [{required: true, message: '请输入投资退出方式', trigger: 'blur'}],
          'projectCompanyInfo.companyName': [{required: true, message: '请输入公司名称', trigger: 'blur'}],
          contacts: [
              {required: true, message: '请输入联系人', trigger: 'blur'},
          ],
          telphone: [
              {required: true, message: '请输入联系电话', trigger: 'blur'},
            { validator: validatePhoneTwo, message: "请输入合法的手机号码", trigger: 'blur'}
          ],
          'projectCompanyInfo.qqNumber': [{required: true, message: '请输入QQ号', trigger: 'blur'}],
          'projectCompanyInfo.wxNumber': [{required: true, message: '请输入微信号', trigger: 'blur'}],
          advantage: [{required: true, message: '请输入项目优势', trigger: 'blur'}],
          progress: [{required: true, message: '请输入项目进展', trigger: 'blur'}],
          financingPlan: [{required: true, message: '请输入融资计划', trigger: 'blur'}],
          cooperationDemand: [{required: true, message: '请输入合作需求', trigger: 'blur'}],
          'projectCompanyInfo.companySynopsis': [{required: true, message: '请输入公司简介', trigger: 'blur'}],
        },
      }
    },
    methods:{
      tinyClearValidate(){
        this.$refs['findProjectForm'].clearValidate('advantage');
      },
      getList() {
        this.listLoading = true;
        fetchGetList(this.listQuery).then(res => {
          this.list = res.data.list;
          this.total = res.data.total;
          this.listLoading = false;
        });
      },
      singleClearValidate(){
        this.$refs['findProjectForm'].clearValidate('imageUrl');
      },
      initFinancingAlreadyOptions(){
        fetchFinancingAlreadyListAll({type:1}).then(res => {
          this.financingAlreadyOptions = [];
          let financingAlreadyList = res.data;
          financingAlreadyList.forEach(item=>{
            this.financingAlreadyOptions.push({label:item.alreadyName,value:item.id})
          })
        })
      },
      initFinancingMainBodyOptions(){
        fetchFinancingMainBodyListAll({type:1}).then(res => {
          this.financingMainBodyOptions = [];
          let financingMainBodyList = res.data;
          financingMainBodyList.forEach(item=>{
            this.financingMainBodyOptions.push({label:item.mainBodyName,value:item.id})
          })
        })
      },
      initFinancingDemandOptions(){
        fetchFinancingDemandListAll({type:1}).then(res => {
          this.financingDemandOptions = [];
          let financingDemandList = res.data;
          financingDemandList.forEach(item=>{
            this.financingDemandOptions.push({label:item.demandName,value:item.id})
          })
        })
      },
      initProjectTypeOptions(){
        fetchProjectTypeListAll({type:1}).then(res => {
          this.projectTypeOptions = [];
          let projectTypeList = res.data;
          projectTypeList.forEach(item=>{
            this.projectTypeOptions.push({label:item.name,value:item.id})
          })
        })
      },
      initProvince(){
        fetchProvince().then(res => {
          this.provinceOptions = [];
          console.log(res)
          res.data.rows.forEach(item => {
            this.provinceOptions.push({label:item.name,value:item.name})
          })
        })
      },
      handleChange(val){
        this.$refs['findProjectForm'].clearValidate(val);
        this.$forceUpdate()
      },
      handleAddCompanyPeople() {
        this.projectData.projectCompanyPeoples.push({
          imgUrl: null,
          name:null,
          personalProfile:null
        });
      },
      removePeople(index){
        this.projectData.projectCompanyPeoples.splice(index,1)
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
        this.projectData = JSON.parse(JSON.stringify(defaultProjectData));
        try{
          this.$refs['findProjectForm'].clearValidate();
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
              if (this.projectData.id != null) {
                this.projectData.projectCompanyInfo.telphone = this.projectData.contacts + ',' + this.projectData.telphone;
                fetchUpdate(this.projectData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              } else {
                this.projectData.projectCompanyInfo.telphone = this.projectData.contacts + ',' + this.projectData.telphone;
                fetchCreate(this.projectData).then(res => {
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
        this.projectData = Object.assign({},row);
        if(this.projectData.projectCompanyInfo.telphone.indexOf(',') != -1){
          let projectDataArr = this.projectData.projectCompanyInfo.telphone.split(',');
          this.projectData.contacts = projectDataArr[0];
          this.projectData.telphone = projectDataArr[1];
        }
        try{
          this.$refs['findProjectForm'].clearValidate();
        }catch (e) {

        }
        this.$forceUpdate();
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该项目?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchDelete(row.id).then(res => {
            this.handleDialogConfirmResult(res)
          });
        });
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
  .cardBg {
    background: #F8F9FC;
    width: 598px;
  }
</style>
