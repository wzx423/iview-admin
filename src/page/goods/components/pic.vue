<template>
    <div style="display: inline-block;">
        <div class="upload-list" v-for="(item, index) in picList" :key="index">
            <img :src="'http://192.168.10.185:3000/' + item">
            <div class="upload-list-cover">
                <Icon type="ios-eye-outline" @click.native="handleView(item)"></Icon>
                <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                <!-- <Icon type="arrow-left-c" @click.native="handleRemove(item)"></Icon>
                <Icon type="arrow-right-c" @click.native="handleRemove(item)"></Icon> -->
            </div>
        </div>
    </div>
</template>
<script>
export default {
  props: (['goodsImg']),
  data () {
    return {
    //   picList: []
    }
  },
  computed: {
    picList () {
      return this.goodsImg
    }
  },
  mounted () {

  },
  methods: {
    handleView (item) {
      this.$Modal.info({
        title: '查看图片',
        content: `<img src="http://192.168.10.185:3000/${item}" style="width:100%;" />`
      })
    },
    handleRemove (index) {
      this.picList.splice(index, 1)
    }
  }
}
</script>
<style>
    .upload-list{
        display: inline-block;
        width: 60px;
        height: 60px;
        text-align: center;
        line-height: 30px;
        border: 1px solid transparent;
        border-radius: 4px;
        overflow: hidden;
        background: #fff;
        position: relative;
        box-shadow: 0 1px 1px rgba(0,0,0,.2);
        margin-right: 4px;
    }
    .upload-list img{
        width: 100%;
        height: 100%;
    }
    .upload-list-cover{
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0,0,0,.5);
    }
    .upload-list:hover .upload-list-cover{
        display: block;
    }
    .upload-list-cover i{
        display: block;
        float: left;
        width: 50%;
        /* height: 50%; */
        color: #fff;
        font-size: 20px;
        line-height: 60px;
        cursor: pointer;
    }
    .upload-list-cover i:hover{
        /* background: #0d0a31; */
        color: red;
    }
</style>
