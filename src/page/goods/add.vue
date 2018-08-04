<template>
<div>
    <Card bordered style="width:520px;margin: 0 auto;">
        <p slot="title"><Icon type="plus-round" style="margin-right:10px;" />添加商品</p>
        <Form ref="formGoods" :model="formGoods" :rules="ruleGoods" :label-width="80" >
            <FormItem label="选择分类" prop="goodsCategory">
                <Select v-model="formGoods.goodsCategory" placeholder="请选择商品分类" >
                    <Option v-for="(item,index) in categoryList" :value="item.typeId" :key="index">{{item.typeName}}</Option>
                </Select>
            </FormItem>
            <FormItem label="商品编号" prop="goodsSn">
                <Input v-model="formGoods.goodsSn" placeholder="请输入商品编号" clearable></Input>
            </FormItem>
            <FormItem label="商品名称" prop="goodsName">
                <Input v-model="formGoods.goodsName" placeholder="请输入商品名称" clearable></Input>
            </FormItem>
            <FormItem label="商品价格" prop="goodsPrice">
                <Input v-model="formGoods.goodsPrice" placeholder="请输入商品价格" clearable></Input>
            </FormItem>
            <FormItem label="商品库存" prop="goodsStock">
                <Input v-model="formGoods.goodsStock" placeholder="请输入商品库存" clearable></Input>
            </FormItem>
            <FormItem label="商品属性">
                <Checkbox v-model="formGoods.isSale" :true-value="1" :false-value="0">上架</Checkbox>
                <Checkbox v-model="formGoods.isHot" :true-value="1" :false-value="0">热销</Checkbox>
                <Checkbox v-model="formGoods.isNew" :true-value="1" :false-value="0">新品</Checkbox>
                <Checkbox v-model="formGoods.isRecom" :true-value="1" :false-value="0">推荐</Checkbox>
                <Checkbox v-model="formGoods.isBest" :true-value="1" :false-value="0">精品</Checkbox>
            </FormItem>
            <FormItem label="商品图片" class="goodsImg">
                <!-- <div class="upload-list" v-for="(item,index) in uploadList" :key="index">
                    <img :src="'http://192.168.10.185:3000/' + item">
                    <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        <Icon type="arrow-left-c" @click.native="handleRemove(item)"></Icon>
                        <Icon type="arrow-right-c" @click.native="handleRemove(item)"></Icon>
                    </div>
                </div> -->
                <goodsPic :goodsImg="uploadList"></goodsPic>
                <template v-if="uploadList.length < 4">
                    <Upload ref="upload" multipart="multipart/form-data" :show-upload-list="false" :format="['jpg','jpeg','png']" :max-size="2048" multiple  type="drag"
                            action="http://192.168.10.185:3000/admin/goods/imgUpload"
                            :before-upload="uploadBefore"
                            :on-exceeded-size="uploadMaxSize"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            style="display: inline-block;width:60px;">
                        <div style="width: 58px;height:58px;line-height: 58px;">
                            <Icon type="camera" size="20"></Icon>
                        </div>
                    </Upload>
                </template>
            </FormItem>
            <FormItem label="SEO关键字" prop="goodsSeoKeywords">
                <Input v-model="formGoods.goodsSeoKeywords" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入SEO关键字" clearable></Input>
            </FormItem>
            <FormItem label="商品描述" prop="goodsDesc">
                <Input v-model="formGoods.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入商品描述" clearable></Input>
            </FormItem>
            <!-- <FormItem label="商品描述" prop="goodsDesc">
                <Input v-model="formGoods.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="输入商品描述" clearable></Input>
            </FormItem> -->
        </Form>
        <div style="text-align:right;">
            <Button type="warning" @click="handleReset('formGoods')" >重填</Button>
            <Button type="primary" @click="validateGoods('formGoods')" style="margin-left: 8px">保存</Button>
        </div>
    </Card>
</div>
</template>
<script>
import {addGoods, getCategory} from '@/utils/api'
import goodsPic from './components/pic'
export default {
  data () {
    return {
      formGoods: {
        goodsCategory: '',
        goodsImg: [],
        goodsSn: '',
        goodsName: '',
        goodsPrice: '',
        goodsStock: 0,
        isSale: 1,
        isHot: 0,
        isNew: 0,
        isRecom: 0,
        isBest: 0,
        goodsDesc: '',
        goodsSeoKeywords: ''
      },
      ruleGoods: {
        goodsCategory: [
          {required: true, message: '请选择商品分类！'}
        ],
        goodsImg: [
          {required: true, message: '请选择商品图片！'}
        ],
        goodsSn: [
          {required: true, message: '请输入商品编号！'}
        ],
        goodsName: [
          {required: true, message: '请输入商品名称！'}
        ],
        goodsPrice: [
          {required: true, message: '请输入商品价格！'}
        ],
        goodsStock: [
          {required: true, message: '请输入商品库存！'}
        ],
        isSale: [
          {required: true, message: '请选择是否上架！'}
        ],
        isHot: [
          {required: true, message: '请选择是否热销！'}
        ],
        isNew: [
          {required: true, message: '请选择是否新品！'}
        ],
        isRecom: [
          {required: true, message: '请选择是否推荐！'}
        ],
        isBest: [
          {required: true, message: '请选择是否精品！'}
        ]
      },
      newCategory: {
        typeName: '',
        typeSort: 0,
        isShow: '1'
      },
      ruleCategory: {
        typeName: [
          {required: true, message: '请输入分类名称！'}
        ],
        typeSort: [
          {required: true, message: '请输入排序号！'}
        ],
        isShow: [
          {required: true, message: '请选择是否显示！'}
        ]
      },
      uploadList: [],
      categoryList: [],
      isCategoryShow: false,
      loading: false
    }
  },
  components: {
    goodsPic
  },
  mounted () {
    this.getCategoryData()
  },
  methods: {
    // 图片大小限制
    uploadMaxSize (file) {
      this.$Notice.warning({
        title: '图片大小不能超过2m！'
      })
    },
    // 图片上传前回调
    uploadBefore (fileList) {
      const check = this.$refs.upload.fileList.length < 4
      if (!check) {
        this.$Notice.warning({
          title: '最多可上传4张图片！'
        })
      }
      return check
    },
    // 图片上传成功回调
    uploadSuccess (response, file, fileList) {
      this.uploadList.push(response.result)
      this.formGoods.goodsImg = this.uploadList
      this.$Notice.success({
        title: '图片上传成功！'
      })
    },
    // 图片上传失败回调
    uploadError (error, file, fileList) {
      console.log(error)
      this.$Notice.error({
        title: '图片上传失败！'
      })
    },
    // 获取分类
    async getCategoryData () {
      const category = await getCategory()
      this.categoryList = category.result
    },
    // 表单重置
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    // 验证商品信息
    validateGoods (name) {
      this.loading = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addNewGoods(this.formGoods)
        } else {
          this.loading = false
          this.$message.error('商品信息不完整！')
        }
      })
    },
    // 添加商品
    async addNewGoods (data) {
      const result = await addGoods(data)
      if (result.code === 0) {
        this.$Notice.success({
          title: result.message
        })
      } else {
        this.$Notice.error({
          title: '商品添加失败！'
        })
      }
    },
    toLoading () {
      this.loading = true
    }
  }
}
</script>
<style scoped>
    .goodsImg{
        height: 60px;
        line-height: 0;
    }
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
        height: 50%;
        color: #fff;
        font-size: 20px;
        line-height: 30px;
        cursor: pointer;
    }
    .upload-list-cover i:hover{
        background: #0d0a31;
        color: red;
    }
</style>
