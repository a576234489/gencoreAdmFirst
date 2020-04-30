<template>
  <div class="content">
    <div class="container clear-fix">
      <div class="first-column">
        <ul>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess1"
                    >
                    <a class="upload-tag">+</a>
                    <div slot="tip" class="el-upload__tip">图片大小:409x199</div>
            </el-upload>
            <img v-if="findSpaceData[0]&&findSpaceData[0].imageUrl" :src="findSpaceData[0].imageUrl" class="image1">
            <span class="img-background" v-if="findSpaceData[0].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[0].imageUrl)"><i class="el-icon-zoom-in"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow1')"><i class="el-icon-delete"></i></a>
            </span>
          </li>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess2"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:409x199</div>
            </el-upload>
            <img v-if="findSpaceData[1]&&findSpaceData[1].imageUrl" :src="findSpaceData[1].imageUrl" class="image1">
            <span class="img-background" v-if="findSpaceData[1]&&findSpaceData[1].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[1].imageUrl)"><i class="el-icon-zoom-in"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow2')"><i class="el-icon-delete"></i></a>
            </span>
          </li>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess3"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:409x199</div>
            </el-upload>
            <img v-if="findSpaceData[2]&&findSpaceData[2].imageUrl" :src="findSpaceData[2].imageUrl" class="image1">
            <span class="img-background" v-if="findSpaceData[2]&&findSpaceData[2].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[2].imageUrl)"><i class="el-icon-zoom-in"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow3')"><i class="el-icon-delete"></i></a>
            </span>
          </li>
        </ul>
      </div>
      <div class="second-column">
        <ul>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess4"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:409x369</div>
            </el-upload>
            <img v-if="findSpaceData[3]&&findSpaceData[3].imageUrl" :src="findSpaceData[3].imageUrl" class="image2">
            <span class="img-background2" v-if="findSpaceData[3]&&findSpaceData[3].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[3].imageUrl)"><i class="el-icon-zoom-in"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow4')"><i class="el-icon-delete"></i></a>
            </span>
          </li>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess5"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:409x236</div>
            </el-upload>
            <img v-if="findSpaceData[4]&&findSpaceData[4].imageUrl" :src="findSpaceData[4].imageUrl" class="image3">
            <span class="img-background3" v-if="findSpaceData[4]&&findSpaceData[4].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[4].imageUrl)"><i class="el-icon-zoom-in"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow5')"><i class="el-icon-delete"></i></a>
            </span>
          </li>
        </ul>
      </div>
      <div class="third-column">
        <ul>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess6"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:200x185</div>
            </el-upload>
            <img v-if="findSpaceData[5]&&findSpaceData[5].imageUrl" :src="findSpaceData[5].imageUrl" class="image4">
            <span class="img-background4" v-if="findSpaceData[5]&&findSpaceData[5].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[5].imageUrl)"><i class="el-icon-zoom-in el-icon-zoom-in-2"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow6')"><i class="el-icon-delete el-icon-delete-2"></i></a>
            </span>
          </li>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess7"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:200x185</div>
            </el-upload>
            <img v-if="findSpaceData[6]&&findSpaceData[6].imageUrl" :src="findSpaceData[6].imageUrl" class="image4">
            <span class="img-background4" v-if="findSpaceData[6]&&findSpaceData[6].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[6].imageUrl)"><i class="el-icon-zoom-in el-icon-zoom-in-2"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow7')"><i class="el-icon-delete el-icon-delete-2"></i></a>
            </span>
          </li>
          <li>
            <el-upload
                    class="upload-comp"
                    :action="singleUploadUrl"
                    list-type="text"
                    :on-success="handleUploadSuccess8"
            >
              <a class="upload-tag">+</a>
              <div slot="tip" class="el-upload__tip">图片大小:409x419</div>
            </el-upload>
            <img v-if="findSpaceData[7]&&findSpaceData[7].imageUrl" :src="findSpaceData[7].imageUrl" class="image5">
            <span class="img-background5" v-if="findSpaceData[7]&&findSpaceData[7].imageUrl">
              <a href="#" @click="handleImg(findSpaceData[7].imageUrl)"><i class="el-icon-zoom-in"></i></a>
              <a href="#" @click="handleDeleteImg('imageShow8')"><i class="el-icon-delete"></i></a>
            </span>
          </li>
        </ul>
      </div>
    </div>
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
  import {SINGLE_UPLOAD_URL} from 'common/const'
  import {fetchListAll,fetchCreate,fetchUpdate,fetchDelete} from 'network/findSpace'
  import {columnSortMixin,commonMixin} from 'common/mixin'
  export default {
    name: "FindSpace",
    data: function () {
      return {
        singleUploadUrl: SINGLE_UPLOAD_URL,
        findSpaceData: null

      }
    },
    created() {
      this.getList();
    },
    mixins: [columnSortMixin, commonMixin],
    methods: {
      handleUploadSuccess1(res) {

        fetchUpdate({id: this.findSpaceData[0].id, modular: 1, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess2(res) {
        fetchUpdate({id: this.findSpaceData[1].id, modular: 2, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess3(res) {
        fetchUpdate({id: this.findSpaceData[2].id, modular: 3, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess4(res) {
        fetchUpdate({id: this.findSpaceData[3].id, modular: 4, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess5(res) {
        fetchUpdate({id: this.findSpaceData[4].id, modular: 5, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess6(res) {
        fetchUpdate({id: this.findSpaceData[5].id, modular: 6, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess7(res) {
        fetchUpdate({id: this.findSpaceData[6].id, modular: 7, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUploadSuccess8(res) {
        fetchUpdate({id: this.findSpaceData[7].id, modular: 8, imageUrl: res.data.url}).then(res => {
          this.handleUpdateResult(res);
        });
      },
      handleUpdateResult(res) {
        if (res.code == 200) {
          this.$message({
            message: res.message,
            type: 'success',
          });
        } else {
          this.$message({
            message: res.message,
            type: 'error'
          });
        }
        this.getList()
      },
      getList() {
        fetchListAll().then(res => {
          // res.data.forEach(item => {
          //   switch (item.modular) {
          //     case 1:
          //       this.imageShow1 = true
          //       this.url1 = item.imageUrl
          //   }
          // })
          this.findSpaceData = res.data;
        });
      },
      handleDeleteImg(imgName) {
        console.log(imgName)
        switch (imgName) {
          case 'imageShow1':
            this.findSpaceData[0].imageUrl = null
            break;
          case 'imageShow2':
            this.findSpaceData[1].imageUrl = null
            break;
          case 'imageShow3':
            this.findSpaceData[2].imageUrl = null
            break;
          case 'imageShow4':
            this.findSpaceData[3].imageUrl = null
            break;
          case 'imageShow5':
            this.findSpaceData[4].imageUrl = null
            break;
          case 'imageShow6':
            this.findSpaceData[5].imageUrl = null
            break;
          case 'imageShow7':
            this.findSpaceData[6].imageUrl = null
            break;
          case 'imageShow8':
            this.findSpaceData[7].imageUrl = null
            break;
        }
      }
    }
  }
</script>

<style scoped>
  .container {
    width: 1243px;
    margin: 25px auto;
  }
  ul,li,.first-column,.second-column,.third-column {
    float: left;
  }
  .first-column,.second-column,.third-column {
    width: 409px;
  }
  .second-column,.third-column {
    margin-left: 8px;
  }
  ul li {
    background-color: aqua;
    margin-bottom: 8px;
    list-style-type: none;
    text-align: center;
  }
  ul li {
    width: 409px;
    height: 199px;
    position: relative;
  }
  .first-column ul li .upload-comp {
    margin-top: 53px;
  }
  .second-column ul li:nth-child(1) .upload-comp {
    margin-top: 139px;
  }
  .second-column ul li:nth-child(2) .upload-comp {
    margin-top: 73px;
  }
  .third-column ul li:nth-child(1) .upload-comp, .third-column ul li:nth-child(2) .upload-comp{
    margin-top: 33px;
  }
  .third-column ul li:nth-child(3) .upload-comp{
    margin-top: 153px;
  }
  .second-column ul li:nth-child(1) {
    width: 409px;
    height: 369px;
  }
  .second-column ul li:nth-child(2) {
    width: 409px;
    height: 236px;
  }
  .third-column ul li:nth-child(1),.third-column ul li:nth-child(2) {
    width: 202px;
    height: 185px;
  }
  .third-column ul li:nth-child(2) {
    margin-left: 5px;
  }
  .third-column ul li:nth-child(3) {
    width: 409px;
    height: 419px;
  }
  .upload-tag{
    font-size: 64px;
  }
  .image1,.image2,.image3,.image4,.image5 {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 409px;
    height: 199px;
  }
  .img-background,.img-background2,.img-background3,.img-background4,.img-background5 {
    width: 409px;
    height: 199px;
    background-color: rgba(0,0,0,.5);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }
  .image2,.img-background2{
    height: 369px;
  }
  .image3,.img-background3{
    height: 236px;
  }
  .image4,.img-background4{
    width: 202px;
    height: 185px;
  }
  .image5,.img-background5{
    width: 409px;
    height: 419px;
  }
  .image1:hover+.img-background,.img-background:hover,.image2:hover+.img-background2,.img-background2:hover,.image3:hover+.img-background3,.img-background3:hover,.image4:hover+.img-background4,.img-background4:hover,.image5:hover+.img-background5,.img-background5:hover {
    display: block;
  }
  .el-icon-zoom-in {
    position: absolute;
    left: 40%;
    top: 50%;
    font-size: 20px;
    color: white;
  }
  .el-icon-delete {
    position: absolute;
    right: 40%;
    top: 50%;
    font-size: 20px;
    color: white;
  }
  .el-icon-delete-2{
    right: 30%;
  }
  .el-icon-zoom-in-2{
    left: 30%;
  }
</style>