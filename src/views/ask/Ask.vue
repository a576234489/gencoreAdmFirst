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
        <el-table-column label="提问人" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.userName}}</template>
        </el-table-column>
        <el-table-column label="提问的方式" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.expertUserId|formatExpertUserId}}</template>
        </el-table-column>
        <el-table-column label="提问的标题" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.title}}</template>
        </el-table-column>
        <el-table-column label="提问的类型" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.askType}}</template>
        </el-table-column>
        <el-table-column label="是否回复" align="center" :show-overflow-tooltip="true">
          <template slot-scope="scope">{{scope.row.askAnswers|askAnswersFilter}}</template>
        </el-table-column>
        <el-table-column label="提问时间" align="center" :sortable="true" :sort-method="sortByDate" :show-overflow-tooltip="true">
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
      title="问答详情"
      :visible.sync="dialogDetailVisible"
      :append-to-body='true'
      width="60%"
    >
      <div style="margin-top: -10px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">问题信息</span>
      </div>
      <div class="question-info">
        <div class="info-title">{{askData.title|formatLongText}}</div>
        <div class="info-ask-type">
          <span class="ask-type">{{askData.askType}}</span>
          <span class="tel">{{askData.createTime|formatCreateTime}}</span>
        </div>
        <div class="info-ask-basic">
          <span class="question-userName">提问人: {{askData.userName}}</nbsp></span>
          <span class="question-tel">手机: {{askData.tel}}</span>
          <span class="question-email">邮箱: {{askData.email}}</span>
        </div>
        <div class="info-ask-content" style="text-indent: 2em">
          {{askData.content}}
        </div>
        <div class="info-ask-img">
          <!--<img :class="{isFirst:index == 0}" v-for = "(item,index) in askData.imageUrlsArray"  :src="item">-->
          <a href="#" @click="handleImg(item)" v-for = "(item,index) in askData.imageUrlsArray"><img :class="{isFirst:index == 0}":src="item"></a>
        </div>
        <div class="info-solve">
          是否解决: <span :class="{'info-unSolve-color':askData.status==0,'info-solve-color':askData.status==1}">{{askData.status|formatStatus}}</span>
        </div>
      </div>
      <div style="margin-top: 30px">
        <svg-icon icon-class="marker" style="color: #606266"></svg-icon>
        <span class="font-small">回复信息</span>
      </div>

      <div class="answer-info" v-if="askData.askAnswers[0].answerUserName">
        <div class="answer-info-user">
          {{askData.askAnswers[0].answerUserName}} :
        </div>
        <div class="answer-info-content" style="text-indent: 2em">
          {{askData.askAnswers[0].content}}
        </div>
        <div class="info-ask-img">
          <a href="#" @click="handleImg(item)" v-for = "(item,index) in askData.replyImageUrlsArray"><img :class="{isFirst:index == 0}":src="item"></a>
        </div>
      </div>
      <div v-else style="font-size: 16px;margin-top: 16px;margin-left: 8px">暂无回复</div>
      <span slot="footer" class="dialog-footer" v-if="!askData.askAnswers[0].id">
        <el-button type="primary" @click="handleReplyDialogConfirm()" size="small">回 复</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="回复问答"
      :visible.sync="dialogReplyVisible"
      :append-to-body='true'
      width="50%">
      <el-form :model="askData.askAnswers[0]"
               label-width="150px" size="small">
        <el-form-item label="选择专家：">
          <el-select :disabled="this.askData.expertUserId!=0" style="width: 500px" v-model="askData.askAnswers[0].answerUserId" placeholder="请选择专家" clearable  @change="handleChange">
            <el-option
              v-for="item in expertOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回复内容：">
          <el-input
            style="width: 500px;"
            :autoSize="true"
            v-model="askData.askAnswers[0].content"
            type="textarea"
            placeholder="请输入回复内容"></el-input>
        </el-form-item>
        <el-form-item label="回复图片：">
          <multi-upload v-model="askData.askAnswers[0].imageUrlsArray"></multi-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogReplyVisible = false" size="small">取 消</el-button>
        <el-button type="primary" @click="handleDialogConfirm()" size="small">确 定</el-button>
      </span>
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
  import {fetchGetList,fetchCreatReply} from 'network/ask'
  import {fetchGetList as fetchExpertGetList} from 'network/expertUser'
  import MultiUpload from '@/components/Upload/multiUpload'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  let formatDate = require("common/utils");
  const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
  };
  const defaultAskData = {
    id:null,
    userId:null,
    expertUserId:null,
    askTypeId:null,
    title:null,
    content:null,
    imageUrl:null,
    imageUrlsArray:[],
    replyImageUrlsArray:[],
    name:null,
    tel:null,
    email:null,
    status:null,
    isDel:null,
    createTime:null,
    updateTime:null,
    expertUserName:null,
    askType:null,
    userName:null,
    askAnswers:[{
      content:null,
      id:null,
      answerUserId:null,
      imageUrlsArray:[]
    }],
  }
  export default {
    name: "Ask",
    data(){
      return {
        listQuery: Object.assign({}, defaultListQuery),
        list: null,
        total: null,
        listLoading: false,
        dialogEditVisible: false,
        askData: Object.assign({},defaultAskData),
        isEdit:false,
        dialogDetailVisible:false,
        dialogReplyVisible:false,
        expertOption:[]
      }
    },
    mixins: [columnSortMixin,commonMixin],
    created(){
      this.getList();
      this.getExpertList();
    },
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
        this.askData = Object.assign({},row)
        if(this.askData.askAnswers.length == 0){
          this.askData.askAnswers = defaultAskData.askAnswers;
        }else{
          this.askData.askAnswers[0].imageUrlsArray = []
        }

        if(this.askData.imageUrl != null && this.askData.imageUrl != ''){
          this.askData.imageUrlsArray = this.askData.imageUrl.split(',');
        }else{
          this.askData.imageUrlsArray = [];
        }

        if(this.askData.askAnswers != null && this.askData.askAnswers.length > 0 && this.askData.askAnswers[0].imageUrl != null && this.askData.askAnswers[0].imageUrl != ''){
          this.askData.replyImageUrlsArray = this.askData.askAnswers[0].imageUrl.split(',');
        }else{
          this.askData.replyImageUrlsArray = [];
        }
      },
      handleDialogConfirm(){
        this.$confirm('是否要确认?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.askData.askAnswers[0].imageUrl = this.askData.askAnswers[0].imageUrlsArray.join(',');
          this.askData.askAnswers[0].askId = this.askData.id;
          fetchCreatReply(this.askData).then(res => {
            this.handleDialogConfirmResult(res);
          })
        })
      },
      handleDialogConfirmResult(res){
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: 'success',
          });
          this.dialogReplyVisible = false;
          this.dialogDetailVisible = false;
          this.getList();
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
      },
      handleChange(){
        this.$forceUpdate();
      },
      handleReplyDialogConfirm(){
        this.dialogReplyVisible = true;
        this.askData.askAnswers[0].content = null;
        this.askData.askAnswers[0].imageUrlsArray = [];
        if(this.askData.expertUserId != 0){
          this.askData.askAnswers[0].answerUserId = this.askData.expertUserId;
        }else{
          this.askData.askAnswers[0].answerUserId = null;
        }
      },
      getExpertList(){
        fetchExpertGetList({pageNum: 1,pageSize: 1000}).then(res => {
          this.expertOption = [];
          let expertList = res.data.list;
          expertList.forEach(item=>{
            this.expertOption.push({label:item.name,value:item.id})
          })
        })
      }
    },
    filters:{
      formatCreateTime(time){
        let date = new Date(time);
        return formatDate(date,'yyyy-MM-dd hh:mm')
      },
      askAnswersFilter(value){
        if(value.length > 0){
          return '已回复'
        }else{
          return '未回复'
        }
      },
      formatLongText(value) {
        if(value===undefined||value===null||value===''){
          return '暂无';
        }else if(value.length>8){
          return value.substr(0, 8) + '...';
        }else{
          return value;
        }
      },
      formatStatus(value){
        if(value == 0){
          return "未解决"
        }else{
          return "以解决"
        }
      },
      formatExpertUserId(value){
        if(value == 0){
          return '提问'
        }else{
          return '私信'
        }
      }
    },
    components:{
      MultiUpload
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
  .question-info{
    margin-top: 15px;
    padding: 0 8px;
  }
  .info-title{
    color: #2c70b6;
    font-size: 27px;
  }
  .info-ask-type{
    margin-top: 10px;
    font-size: 16px;
  }
  .ask-type{
    color: #2c70b6;
  }
  .tel{
    margin-left: 20px;
  }
  .info-ask-basic{
    margin-top: 16px;
    font-size: 16px;
  }
  .question-tel{
    margin-left: 20px;
  }
  .question-email{
    margin-left: 20px;
  }
  .info-ask-content{
    margin-top: 30px;
    font-size: 16px;
  }
  .info-ask-img img{
    margin-top: 16px;
    width: 200px;
    height: 150px;
  }
  .info-ask-img img{
    margin-top: 16px;
    width: 200px;
    height: 150px;
    margin-left: 25px;
  }
  .isFirst{
    margin-left: 0px !important;
  }
  .info-solve{
    margin-top: 16px;
    font-size: 16px;
  }
  .info-unSolve-color{
    color: #b23634;
  }
  .info-solve-color{
    color: #53a9dd;
  }
  .answer-info{
    padding: 0 8px;
  }
  .answer-info .answer-info-user{
    font-size: 16px;
    margin-top: 16px;
  }
  .answer-info-content{
    font-size: 16px;
    margin-top: 5px;
  }
</style>
