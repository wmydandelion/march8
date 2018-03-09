<template>
  <div class="top250">
    <div class="movie-list" v-for="m in list">
      <div class="movie-img">
        <img :src="m.images.large"/>
      </div>
      <div class="movie-title">
        <span>
          {{m.title}}
        </span>
        <p>
          <span v-for="gen in m.genres">
          {{gen}}
        </span>
        ({{m.year}})(平均{{m.rating.average}}分)
        </p>
      </div>
    </div>
    <div class="loading" v-show="isShow">
      <span>
        <img src="assets/img/loading.gif">
      </span>
    </div>
  </div>
</template>

<script>
  import Axios from 'axios'
  import $ from 'jquery'
export default {
  name: 'header',
  data () {
    return {
      list:[],
      isShow : false
    }
  },
  mounted(){
    // axios
    this.loadData();
    var _this = that;
    $(window).scroll(function(){
      var windowHeight = $(this).height();
      var scrollTop = $(this).scrollTop();
      var dHeight = $(document).height();
      if(windowHeight + scrollTop >= dHeight){
         _this.isShow = true;
        _this.loadData();
      }
    });
  },
  methods:{
      loadData(){
      Axios.get(API_PROXY+'https://api.douban.com/v2/movie/top250?count=10&start='+this.list.length)
            .then((res)=>{
              this.list = this.list.concat(res.data.subjects);
              this.isShow = false;
          });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .top250{
      margin-top: 2rem;
      margin-bottom: 1rem;
      overflow: hidden;
    }
    .movie-list{
      padding: 0.4rem;
      margin: 0.4rem 0;
    }
    .movie-list .movie-img{
      width: 0.8rem;
      height: 0.8rem;
      float: left;
    }
    .movie-list .movie-img img{
      width: 100%;
      height: 100%;
    }
    .movie-list .movie-title{
      float: left;
      width: 4.0rem;
      margin-left: 0.6rem;
      border-bottom: 1px #ccc solid;
    }
    .loading{
     text-align: center;
    }
</style>
