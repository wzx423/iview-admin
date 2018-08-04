<template>
    <div style="padding-top:18px;padding-left:48px;margin-top:6px;">
        <div style="display:flex;">
            <div>产品图片：</div>
            <div class="upload-list" v-for="(value,index) in imgList" v-bind:key="index">
                <template v-if="value">
                    <img :src="'http://192.168.10.185:3000/'+value">
                    <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(value)"></Icon>
                    </div>
                </template>
            </div>
        </div>
        <p>
            <span class="info-key">产品ID：</span>
            <span class="info-value">{{goods.goodsId}}</span>
        </p>
        <p>
            <span class="info-key">产品编号：</span>
            <span class="info-value">{{goods.goodsSn}}</span>
        </p>
        <p>
            <span class="info-key">产品名称：</span>
            <span class="info-value">{{goods.goodsName}}</span>
        </p>
        <p>
            <span class="info-key">产品价格：</span>
            <span class="info-value">{{goods.goodsPrice}}</span>
        </p>
        <p>
            <span class="info-key">产品库存：</span>
            <span class="info-value">{{goods.goodsStock}}</span>
        </p>
        <p>
            <span class="info-key">总销售量：</span>
            <span class="info-value">{{goods.saleNum}}</span>
        </p>
        <p>
            <span class="info-key">产品分类：</span>
            <span class="info-value">{{goods.goodsCategory}}</span>
        </p>
        <p>
            <span class="info-key">是否上架：</span>
            <span class="info-value">{{goods.isSale === 1 ? '是' : '否'}}</span>
        </p>
        <p>
            <span class="info-key">是否热销：</span>
            <span class="info-value">{{goods.isHot === 1 ? '是' : '否'}}</span>
        </p>
        <p>
            <span class="info-key">是否新品：</span>
            <span class="info-value">{{goods.isNew === 1 ? '是' : '否'}}</span>
        </p>
        <p>
            <span class="info-key">是否推荐：</span>
            <span class="info-value">{{goods.isRecom === 1 ? '是' : '否'}}</span>
        </p>
        <p>
            <span class="info-key">是否精品：</span>
            <span class="info-value">{{goods.isBest === 1 ? '是' : '否'}}</span>
        </p>
        <p>
            <span class="info-key">关键字：</span>
            <span class="info-value">{{goods.goodsSeoKeywords}}</span>
        </p>
        <p>
            <span class="info-key">产品描述：</span>
            <span class="info-value">{{goods.goodsDesc}}</span>
        </p>
        <p>
            <span class="info-key">上架时间：</span>
            <span class="info-value">{{formatTime(goods.saleTime)}}</span>
        </p>
        <p>
            <span class="info-key">创建时间：</span>
            <span class="info-value">{{formatTime(goods.createTime)}}</span>
        </p>
    </div>
</template>
<script>
export default {
  name: 'info',
  props: {
    goods: Object
  },
  computed: {
    imgList () {
      return JSON.parse(this.goods.goodsImg)
    }
  },
  methods: {
    formatTime (timeStamp) {
      function add0 (m) {
        return m < 10 ? '0' + m : m
      }
      var time = new Date(timeStamp)
      var y = time.getFullYear()
      var m = time.getMonth() + 1
      var d = time.getDate()
      var h = time.getHours()
      var mm = time.getMinutes()
      var s = time.getSeconds()
      return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
    },
    handleView (a) {
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
        margin:auto;
        line-height: 60px;
        color: #fff;
        font-size: 20px;
        cursor: pointer;
    }
</style>
