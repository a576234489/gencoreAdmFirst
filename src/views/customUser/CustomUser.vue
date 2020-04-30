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
        <el-table-column label="编号" width="100" align="center" :sortable="true" :sort-method="sortByDate">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="账号" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.username|formatName}}</template>
        </el-table-column>
        <el-table-column label="姓名" align="center" prop="customUserInfo.name" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('name')}}</template>
        </el-table-column>
        <el-table-column label="公司名称" align="center" prop="customUserInfo.companyName" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('companyName')}}</template>
        </el-table-column>
        <el-table-column label="地址" align="center" prop="customUserInfo.companyAddress" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('companyAddress')}}</template>
        </el-table-column>
        <el-table-column label="职务" align="center" prop="customUserInfo.duty" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('duty')}}</template>
        </el-table-column>
        <el-table-column label="行业" align="center" prop="customUserInfo.industry" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('industry')}}</template>
        </el-table-column>
        <el-table-column label="联系电话" align="center" prop="customUserInfo.tel" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('tel')}}</template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" prop="customUserInfo.email" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.customUserInfo|formatContent('email')}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime|formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleShow(scope.$index, scope.row)">
              查看
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
      title="客户详情"
      :visible.sync="dialogDetailVisible"
      :append-to-body='true'
      width="60%"
    >
      <div class="clear-fix detail">
        <dl class="detail-title">
          <dt><span>头像</span></dt>
          <dd><span>编号</span></dd>
          <dd><span>账号</span></dd>
          <dd><span>性别</span></dd>
          <dd><span>公司名称</span></dd>
          <dd><span>公司地址</span></dd>
          <dd><span>联系电话</span></dd>
          <dd><span>邮箱</span></dd>
          <dd><span>职业</span></dd>
          <dd><span>行业</span></dd>
          <dd><span>主营业务</span></dd>
        </dl>

        <dl class="detail-title detail-content">
          <dt><a href="#" @click="handleImg(customUserData.customUserInfo.headImgUrl)"><img :src="customUserData.customUserInfo.headImgUrl"></a></dt>
          <dd><span>{{customUserData.id}}</span></dd>
          <dd><span>{{customUserData.username|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.sex|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.companyName|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.companyAddress|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.tel|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.email|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.duty|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.industry|formatContentLast}}</span></dd>
          <dd><span>{{customUserData.customUserInfo.lineBusiness|formatContentLast}}</span></dd>
        </dl>
      </div>
    </el-dialog>
    <el-dialog
            :visible.sync="dialogImageVisible"
            :append-to-body='true'
            width="40%"
    >
      <div class="image-parent">
        <img :src="customUserData.customUserInfo.headImgUrl" :style="'width:' + imageWidth+'px;'+'height:'+imageHeight+'px'">
        <img @load="handleImageOnload" ref='imgShow' :src="customUserData.customUserInfo.headImgUrl" style="display:none">
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchGetList} from 'network/customUser'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
  };
  const defaultCustomUserData = {
    id:null,
    username:null,
    password:null,
    salt:null,
    isLocked:null,
    remark:null,
    createTime:null,
    updateTime:null,
    wxOpenid:null,
    type:null,
    customUserInfo:{
      userId:null,
      headImgUrl:null,
      name:null,
      sex:null,
      companyName:null,
      companyAddress:null,
      duty:null,
      industry:null,
      lineBusiness:null,
      tel:null,
      email:null,
      industry:null,
    }

  }
  export default {
    name: "CustomUser",
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        customUserData: Object.assign({},defaultCustomUserData),
        isEdit:false,
        dialogDetailVisible:false
      }
    },
    created(){
      this.getList()
    },
    mixins: [columnSortMixin,commonMixin],
    methods:{
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
      handleShow(index,row){
        this.dialogDetailVisible = true
        this.customUserData = Object.assign({},row)
      },
      handlePass(index,row){
        this.$confirm('审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchUpdateStatus({status:1,id:row.id}).then(res => {
            this.handleDialogConfirmResult(res)
          })
        });
      },
      handleUnPass(index,row){
        this.$confirm('审核不通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          fetchUpdateStatus({status:2,id:row.id}).then(res => {
            this.handleDialogConfirmResult(res)
          })
        });
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
    },
    filters:{
      formatCreateTime(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      },
      formatName(name){
        if(name == null || name == ''){
          return '微信用户'
        }else{
          return name;
        }
      },
    },

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
  .table-layout {
    margin-top: 20px;
    border-left: 1px solid #DCDFE6;
    border-top: 1px solid #DCDFE6;
  }
  .table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
  }
  .table-cell-title{
    border-right: 1px solid #DCDFE6;
    border-bottom: 1px solid #DCDFE6;
    padding: 10px;
    background: #F2F6FC;
    text-align: center;
    font-size: 14px;
    color: #303133;
  }
  .batch-operate-container{
    display: inline-block;
    margin-top: 20px;
  }
</style>
