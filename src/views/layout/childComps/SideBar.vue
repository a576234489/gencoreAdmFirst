<template>
  <el-menu
    background-color="#304156"
    text-color="#bfcbd9"
    :default-active="$route.path"
    active-text-color="#409EFF"
    :collapse="isCollapse"
  >
    <side-bar-item :routes="routes" id="side-bar-item"></side-bar-item>
  </el-menu>
</template>

<script>
  import {mapGetters} from 'vuex'
  import SideBarItem from 'views/layout/childComps/SideBarItem'
  export default {
    name: "SideBar",
    computed:{
      ...mapGetters(['sidebar','routers']),
      isCollapse(){
        return !this.sidebar.opened
      },
      routes(){
        console.log(this.routers)
        return this.routers
      },
    },
    created(){
      console.log(this.$router.options.routes)
    },
    components:{
      SideBarItem,
    }

  }
</script>

<style scoped>

</style>
