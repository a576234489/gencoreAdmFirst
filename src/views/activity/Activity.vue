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
          <el-form-item label="活动类型：">
            <el-select style="width: 203px" v-model="listQuery.activityTypeId" placeholder="请选择活动类型" clearable>
              <el-option
                v-for="item in activityTypeOptions"
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
        <el-table-column label="举办方" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.organizers}}</template>
        </el-table-column>
        <el-table-column label="参会人数" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.peopleNumber}}</template>
        </el-table-column>
        <el-table-column label="活动标题" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="地址" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.address}}</template>
        </el-table-column>
        <el-table-column label="开始时间" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.startTime|formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="结束时间" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.endTime|formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="活动状态" align="center">
          <template slot-scope="scope">{{scope.row.status|formatStatus}}</template>
        </el-table-column>
        <el-table-column label="发布时间" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
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
      :title="isEdit?'编辑活动':'添加活动'"
      :visible.sync="dialogEditVisible"
      :append-to-body='true'
      width="58%">
      <el-form :model="activityData"
               label-width="170px" size="small"
               ref="activityForm"
               :rules = "rules"
      >
        <el-form-item label="活动类型：" prop="activityTypeId">
          <el-select style="width: 598px" v-model="activityData.activityTypeId" placeholder="请选择活动类型" clearable  @change="handleActivityTypeChange">
            <el-option
              v-for="item in activityTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="举办方：" prop="organizers">
          <el-input placeholder="请输入举办方" v-model="activityData.organizers" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="参会人数：" prop="peopleNumber">
          <el-input placeholder="请输入参会人数" v-model="activityData.peopleNumber" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="标题：" prop="title">
          <el-input placeholder="请输入标题" v-model="activityData.title" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="活动举办地址：" prop="address">
          <el-input placeholder="请输入活动举办地址" v-model="activityData.address" style="width: 598px" clearable></el-input>
        </el-form-item>
        <el-form-item label="活动开始时间：" prop="startTime">
          <el-date-picker
            class="input-width"
            v-model="activityData.startTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动结束时间：" prop="endTime">
          <el-date-picker
            class="input-width"
            v-model="activityData.endTime"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
            type="datetime"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动状态：" prop="status">
          <el-select style="width: 598px" v-model="activityData.status" placeholder="请选择活动状态" clearable  @change="handleActivityStatusChange">
            <el-option
              v-for="item in activityStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热门活动预览图：" prop="popularImgUrl">
          <single-upload v-model="activityData.popularImgUrl"
                         style="width: 300px;display: inline-block;margin-left: 10px"
                         @singleClearValidate = "singleClearValidate"
                         ></single-upload>
        </el-form-item>
        <el-form-item label="活动展示图：" prop="imageUrlsArray">
          <multi-upload v-model="activityData.imageUrlsArray" @multiClearValidate="multiClearValidate"></multi-upload>
        </el-form-item>
        <el-form-item label="活动内容：" prop="content">
          <Tinymce @tinyClearValidate="tinyClearValidate" v-if="dialogEditVisible" ref="editor" v-model="activityData.content" :height="400" :width="600"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm('activityForm')" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {fetchListAll as fetchActivityTypeListAll} from 'network/activityType'
  import {fetchGetList,fetchCreate,fetchUpdate,fetchDelete} from 'network/activity'
  import SingleUpload from 'components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'
  import Tinymce from 'components/Tinymce'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  import {isInteger} from 'common/validate'
  let formatDate = require("common/utils");
  const defaultActivityData = {
    id:null,
    imageUrls:null,
    imageUrlsArray:[],
    popularImgUrl:null,
    organizers:null,
    peopleNumber:null,
    title:null,
    content:null,
    address:null,
    status:null,
    activityTypeId:null,
    startTime:null,
    endTime:null,
    type:1,
    create_time:null
  }
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    title: null,
    activityTypeId:null,
    type: 1
  };
  export default {
    name: "Activity",
    created(){
      this.getActivityTypeList();
      this.getList()
    },
    mixins: [columnSortMixin,commonMixin],
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        activityData: Object.assign({}, defaultActivityData),
        isEdit:false,
        activityTypeOptions:[],
        activityStatus:[
          {
            label:'未开始',
            value:0,
          },
          {
            label:'进行中',
            value:1,
          },
          {
            label:'已结束',
            value:2,
          },
        ],
        rules: {
          activityTypeId: [{required: true, message: '请选择活动类型', trigger: 'blur'}],
          organizers: [{required: true, message: '请输入举办方', trigger: 'blur'}],
          peopleNumber: [
            {required: true, message: '请输入参会人数', trigger: 'blur'},
            { validator: isInteger, message: "参会人数格式不正确", trigger: 'blur'}
          ],
          title: [{required: true, message: '请输入标题', trigger: 'blur'}],
          address: [{required: true, message: '请输入活动举办地址', trigger: 'blur'}],
          startTime: [{required: true, message: '请选择活动开始时间', trigger: 'blur'}],
          endTime: [{required: true, message: '请选择活动结束时间', trigger: 'blur'}],
          status: [{required: true, message: '请选择活动状态', trigger: 'blur'}],
          popularImgUrl: [{required: true, message: '请上传热门活动预览图', trigger: 'blur'}],
          imageUrlsArray: [{required: true, message: '请上传活动展示图',trigger: 'blur'},],
          content: [{required: true, message: '请输入活动内容', trigger: 'blur'}],
        },
      }
    },
    methods:{
      getActivityTypeList(){
        fetchActivityTypeListAll().then(res=>{
          this.activityTypeOptions = [];
          let newsTypeList = res.data;
          newsTypeList.forEach(item=>{
            this.activityTypeOptions.push({label:item.name,value:item.id})
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
        this.activityData = JSON.parse(JSON.stringify(defaultActivityData));
        try{
          this.$refs['activityForm'].clearValidate();
        }catch (e) {

        }
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
      handleActivityTypeChange(){
        this.$refs['activityForm'].clearValidate('activityTypeId');
      },
      handleActivityStatusChange(){
        this.$refs['activityForm'].clearValidate('status');
      },
      singleClearValidate(){
        //验证新闻缩略图
        this.$refs['activityForm'].clearValidate('popularImgUrl');
      },
      multiClearValidate(){
        //验证新闻缩略图
        this.$refs['activityForm'].clearValidate('imageUrlsArray');
      },
      tinyClearValidate(){
        this.$refs['activityForm'].clearValidate('content');
      },
      handleDialogConfirm(ref){
        this.$refs[ref].validate((valid) => {
          if (valid) {
            if(this.activityData.id == null) {
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.activityData.imageUrls = this.activityData.imageUrlsArray.join(',');
                fetchCreate(this.activityData).then(res => {
                  this.handleDialogConfirmResult(res)
                })
              })
            }else{
              this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
              }).then(() => {
                this.activityData.imageUrls = this.activityData.imageUrlsArray.join(',');
                fetchUpdate(this.activityData).then(res => {
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
        console.log(row)
        this.activityData = JSON.parse(JSON.stringify(row))
        if(this.activityData.imageUrls != null && this.activityData.imageUrls != ''){
          this.$set(this.activityData, 'imageUrlsArray', this.activityData.imageUrls.split(','));
        }else{
          this.$set(this.activityData, 'imageUrlsArray', []);
        }
        try{
          this.$refs['activityForm'].clearValidate();
        }catch (e) {

        }
        console.log(this.activityData)
      },
      handleDelete(index,row){
        this.$confirm('是否要删除该活动?', '提示', {
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
          return '未开始';
        }else if(value == 1){
          return '进行中';
        }else {
          return '已结束'
        }
      }
    },
    components:{
      SingleUpload,
      MultiUpload,
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
