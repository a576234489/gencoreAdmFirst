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
          <el-form-item label="审核状态：">
            <el-select v-model="listQuery.status" placeholder="请选择审核状态" clearable style="width: 203px">
              <el-option
                      v-for="item in examineOption"
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
        <el-table-column label="公司名称" width="100" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.companyName}}</template>
        </el-table-column>
        <el-table-column label="公司总人数" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.companyNumber}}</template>
        </el-table-column>
        <el-table-column label="行业类别" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.industryType}}</template>
        </el-table-column>
        <el-table-column label="主要产品/项目" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.productRemark}}</template>
        </el-table-column>
        <el-table-column label="联系方式" align="center" :sortable="true" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.tel}}</template>
        </el-table-column>
        <el-table-column label="创建日期" align="center" :sortable="true" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.createTime|formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="审核日期" align="center" :sortable="true" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.applyforTime|formatCreateTime}}</template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" :sortable="true" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.status|formatStatus}}</template>
        </el-table-column>
        <el-table-column label="操作" width="140" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
                       type="text"
                       @click="handleShow(scope.$index, scope.row)">
              查看
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handlePass(scope.$index, scope.row)">通过
            </el-button>
            <el-button size="mini"
                       type="text"
                       @click="handleUnPass(scope.$index, scope.row)">不通过
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
      title="入驻详情"
      :visible.sync="dialogDetailVisible"
      :append-to-body='true'
      width="60%"
    >
      <div class="clear-fix detail">
        <dl class="detail-title">
          <dd><span>编号</span></dd>
          <dd><span>公司名称</span></dd>
          <dd><span>公司总人数</span></dd>
          <dd><span>行业类别</span></dd>
          <dd><span>主要产品/项目</span></dd>
          <dd><span>联系方式</span></dd>
          <dd><span>审核状态</span></dd>
          <dd><span>创建日期</span></dd>
          <dd><span>审核日期</span></dd>
        </dl>

        <dl class="detail-title detail-content">
          <dd><span>{{enterpriseApplyForData.id}}</span></dd>
          <dd><span>{{enterpriseApplyForData.companyName|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.companyNumber|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.industryType|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.productRemark|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.tel|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.status | formatStatus|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.createTime | formatCreateTime|formatContentLast}}</span></dd>
          <dd><span>{{enterpriseApplyForData.applyforTime | formatCreateTime|formatContentLast}}</span></dd>
        </dl>
      </div>
    </el-dialog>
    <el-dialog
            :visible.sync="dialogImageVisible"
            :append-to-body='true'
            width="40%"
    >
      <div class="image-parent">
        <img :src="pendingShowImage" :style="'width:' + imageWidth+'px;'+'height:'+imageHeight+'px'">
        <img @load="handleImageOnload" ref='imgShow' :src="pendingShowImage" style="display:none">
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import {fetchGetList,fetchUpdateStatus} from 'network/enterpriseApplyFor'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
  };
  const defaultEnterpriseApplyForData = {
    id:null,
    userId:null,
    originator:null,
    companyName:null,
    businessLicense:null,
    legalPerson:null,
    registerCapital:null,
    companyNumber:null,
    industryType:null,
    establishTime:null,
    businessScope:null,
    companyAddress:null,
    productRemark:null,
    otherRemark:null,
    businessLicenseUrl:null,
    businessLicenseUrlArray:[],
    demandArea:null,
    contacts:null,
    duty:null,
    tel:null,
    email:null,
    status:null,
    type:null,
    createTime:null,
    applyforTime:null
  }
  export default {
    name: "EnterpriseApplyFor",
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        enterpriseApplyForData: Object.assign({},defaultEnterpriseApplyForData),
        isEdit:false,
        dialogDetailVisible:false,
        examineOption: [
          {
            label:'未审核',
            value:0
          },
          {
            label:'审核通过',
            value:1
          },
          {
            label:'审核不通过',
            value:2
          },
        ]
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getList()
    },
    methods:{
      handleSearchList(){
        this.listQuery.pageNum = 1;
        this.getList()
      },
      handleResetSearch(){
        this.listQuery = Object.assign({},defaultListQuery)
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
      handleShow(index,row){
        this.dialogDetailVisible = true
        this.enterpriseApplyForData = Object.assign({},defaultEnterpriseApplyForData);
        this.enterpriseApplyForData = Object.assign({},row)
        if(this.enterpriseApplyForData.businessLicenseUrl != null && this.enterpriseApplyForData.businessLicenseUrl != ''){
          this.enterpriseApplyForData.businessLicenseUrlArray = this.enterpriseApplyForData.businessLicenseUrl.split(',');
        }else{
          this.enterpriseApplyForData.businessLicenseUrlArray = [];
        }
      },
      handlePass(index,row){
        this.$confirm('审核通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let enterApplyFor = JSON.parse(JSON.stringify(row))
          enterApplyFor.status = 1;
          fetchUpdateStatus(enterApplyFor).then(res => {
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
          let enterApplyFor = JSON.parse(JSON.stringify(row))
          enterApplyFor.status = 2;
          fetchUpdateStatus(enterApplyFor).then(res => {
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
        if(time != null && time != ''){
          let date = new Date(time);
          return formatDate(date,'yyyy-MM-dd hh:mm:ss')
        }else {
          return ''
        }
      },
      formatStatus(value){
        if(value == 0){
          return '未审核';
        }else if(value == 1){
          return '审核通过';
        }else{
          return '审核不通过';
        }
      },
      formatType(value){
        if(value == 1){
          return '有营业执照申请';
        }else{
          return '无营业执照申请'
        }
      }
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
  .detail-content {
    float: left;
    width: 710px;
  }
  .detail {
    border: 1px solid #d7d7d7;
    width: 912px;
  }
</style>
