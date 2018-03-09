<template>
  <div id="app">
    <leftNav></leftNav>
    <div class="main">
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {
    leftNav
  }
}
</script>
<script>
import leftNav from '@/components/common/leftNav';
export default {
  name:'app',
  components:{
    leftNav
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main{
  float: left;
  width: 95%;
  background: #EFF2F7;
  height:100%;
  overflow: auto;
}
</style>
