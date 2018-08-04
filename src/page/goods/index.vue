<template>
    <div>
        <Card bordered>
            <p slot="title">产品管理</p>
            <Row type="flex" justify="space-between" class="code-row">
                <Col>
                    <Input v-model="search_value" style="max-width:320px;">
                        <Select v-model="search_condition" slot="prepend" style="width: 80px">
                            <Option value="goodsSn">产品编号</Option>
                            <Option value="goodsName">产品名称</Option>
                        </Select>
                        <Button slot="append" icon="ios-search" @click="goodsSearch"></Button>
                    </Input>
                </Col>
                <Col>
                    <Button type="info" @click="$router.push('/goods/add')">
                        <Icon type="plus-round" style="margin-right:10px;"></Icon>
                        添加产品
                    </Button>
                </Col>
            </Row>
            <Table border stripe :columns="columns" :data="goodsList" size="small" no-data-text="暂无数据" no-filtered-data-text="暂无筛选结果"></Table>
            <div style="padding-bottom:1px; margin-top:16px; overflow:hidden;">
                <Page style="float:right;" :total="goodsTotal" :page-size="10" size="small" show-total show-elevator show-sizer  @on-change="changepage" @on-page-size-change="changepagesize"></Page>
            </div>
        </Card>
        <!-- 修改产品弹窗 -->
        <Modal title="修改产品" v-model="edit_isShow" :mask-closable="false" :closable="false">
          <Form ref="editGoods" :model="editGoods" :rules="ruleValidate" :label-width="80" >
              <FormItem label="产品分类" prop="goodsCategory">
                  <Select v-model="editGoods.goodsCategory">
                      <Option v-for="(item, index) in categoryList" :value="item.typeId" :key="index">{{item.typeName}}</Option>
                  </Select>
              </FormItem>
              <FormItem label="产品编号" prop="goodsSn">
                  <Input v-model="editGoods.goodsSn" placeholder="请输入产品编号" clearable></Input>
              </FormItem>
              <FormItem label="产品名称" prop="goodsName">
                  <Input v-model="editGoods.goodsName" placeholder="请输入产品名称" clearable></Input>
              </FormItem>
              <FormItem label="产品价格" prop="goodsPrice">
                  <Input v-model="editGoods.goodsPrice" placeholder="请输入产品价格" clearable></Input>
              </FormItem>
              <FormItem label="产品库存" prop="goodsStock">
                  <Input v-model="editGoods.goodsStock" placeholder="请输入产品库存" clearable></Input>
              </FormItem>
              <FormItem label="商品属性">
                  <Checkbox v-model="editGoods.isSale" :true-value="1" :false-value="0">上架</Checkbox>
                  <Checkbox v-model="editGoods.isHot" :true-value="1" :false-value="0">热销</Checkbox>
                  <Checkbox v-model="editGoods.isNew" :true-value="1" :false-value="0">新品</Checkbox>
                  <Checkbox v-model="editGoods.isRecom" :true-value="1" :false-value="0">推荐</Checkbox>
                  <Checkbox v-model="editGoods.isBest" :true-value="1" :false-value="0">精品</Checkbox>
              </FormItem>
              <FormItem label="产品图片" prop="goodsSn">
                  <!-- <div class="upload-list" v-for="(item, index) in editGoods.goodsImg" :key="index">
                      <img :src="'http://192.168.10.185:3000/' + item">
                      <div class="upload-list-cover">
                          <Icon type="ios-eye-outline" @click="viewPic(item)"></Icon>
                          <Icon type="ios-trash-outline" @click="removePic(item)"></Icon>
                          <Icon type="arrow-left-c" @click="handleRemove(item)"></Icon>
                          <Icon type="arrow-right-c" @click="handleRemove(item)"></Icon>
                      </div>
                  </div> -->
                  <Upload ref="upload"
                            multipart="multipart/form-data"
                            :show-upload-list="false"
                            :format="['jpg','jpeg','png']"
                            :max-size="2048"
                            multiple
                            type="drag"
                            action="http://192.168.10.185:3000/admin/goods/imgUpload"
                            :before-upload="uploadBefore"
                            :on-success="uploadSuccess"
                            :on-error="uploadError"
                            style="display: inline-block;width:60px;">
                          <div style="width: 58px;height:58px;line-height: 58px;">
                              <Icon type="camera" size="20"></Icon>
                          </div>
                  </Upload>
              </FormItem>
              <FormItem label="SEO关键字" prop="goodsSeoKeywords">
                  <Input v-model="editGoods.goodsSeoKeywords" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
              </FormItem>
              <FormItem label="产品描述" prop="goodsDesc">
                  <Input v-model="editGoods.goodsDesc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="Enter something..."></Input>
              </FormItem>
          </Form>
          <div slot="footer">
              <Button type="error" @click="editClose" style="margin-left: 8px">取消</Button>
              <Button type="primary" @click="editSubmit('editGoods')">保存</Button>
          </div>
      </Modal>
    </div>
</template>

<script>
import info from './components/info'
import {getGoods, searchGoods, getCategory} from '@/utils/api'
export default {
  data () {
    return {
      goodsList: [],
      goodsTotal: 0,
      categoryList: [],
      edit_isShow: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '产品编号',
          key: 'goodsSn',
          width: 96
        },
        {
          title: '产品名称',
          key: 'goodsName',
          minWidth: 120,
          ellipsis: true
        },
        {
          title: '价格',
          key: 'goodsPrice',
          width: 80,
          align: 'center',
          sortable: true
        },
        {
          title: '所属分类',
          key: 'goodsCategory',
          width: 100,
          ellipsis: true,
          render: (h, params) => {
            let texts = ''
            this.categoryList.forEach(function (item, index, array) {
              if (params.row.goodsCategory === item.typeId) {
                texts = item.typeName
              }
            })
            return h('span', texts)
          }
        },
        {
          title: '上架时间',
          key: 'saleTime',
          width: 150,
          render: (h, params) => {
            return h('span', this.formatTime(params.row.saleTime))
          }
        },
        {
          title: '操作',
          width: 170,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'primary',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.$Modal.info({
                      title: '产品详情',
                      width: 520,
                      render: (h) => {
                        return h(info, {
                          props: {
                            goods: params.row
                          }
                        })
                      }
                    })
                  }
                }
              }, '详情'),
              h('Button', {
                props: {
                  type: 'warning',
                  size: 'small'
                },
                style: {
                  marginRight: '5px'
                },
                on: {
                  click: () => {
                    this.editGoods = params.row
                    this.editGoods.goodsImg = JSON.parse(this.editGoods.goodsImg)
                    this.edit_isShow = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small'
                  // disabled: true
                },
                on: {
                  click: () => {
                    this.goodsRemove(params.row)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      deleteId: '',
      search_value: '',
      search_condition: 'goodsSn',
      editGoods: {},
      ruleValidate: {
        goodsSn: [{
          required: true, message: '请输入产品编号！'
        }],
        goodsName: [{
          required: true, message: '请输入产品名称！'
        }],
        goodsPrice: [{
          required: true, message: '请输入产品价格！'
        }],
        goodsStock: [{
          required: true, message: '请输入产品库存！'
        }],
        goodsCategory: [{
          required: true, message: '请选择产品分类！'
        }],
        isSale: [{
          required: true, message: '请选择是否上架！'
        }],
        isHot: [{
          required: true, message: '请选择是否热销！'
        }],
        isNew: [{
          required: true, message: '请选择是否新品！'
        }],
        isRecom: [{
          required: true, message: '请选择是否推荐！'
        }],
        isBest: [{
          required: true, message: '请选择是否精品！'
        }]
      },
      uploadList: []
    }
  },
  components: {
  },
  computed: {
  },
  mounted () {
    this.changepage(1)
    this.getCategoryData()
  },
  methods: {
    // 改变页码获取数据
    async changepage (index) {
      const data = await getGoods(index)
      this.goodsList = data.result.goodsList
      this.goodsTotal = data.result.goodsTotal
    },
    // 获取分类
    async getCategoryData () {
      const category = await getCategory()
      this.categoryList = category.result
    },
    changepagesize () {
    },
    // 删除产品
    goodsRemove (goods) {
      this.$Modal.confirm({
        title: '删除产品',
        content: `<p>产品编号：${goods.goodsSn}</p><p>产品名称：${goods.goodsName}</p><p>你确定要删除此产品吗？</p>`,
        onOk: () => {
        },
        onCancel: () => {
        }
      })
    },
    // 商品搜索
    async goodsSearch () {
      const data = await searchGoods(this.search_condition + '=' + this.search_value)
      this.goodsList = data.result
      this.goodsTotal = data.result.length
    },
    // 格式化时间
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
      return `${y}-${add0(m)}-${add0(d)} ${add0(h)}:${add0(mm)}:${add0(s)}`
    },
    // 关闭商品修改面板
    editClose () {
      this.edit_isShow = false
    },
    reversedMessage: function () {
      return this.message.split('').reverse().join('')
    },
    editSubmit (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('http://192.168.10.185:3000/admin/goods/edit', JSON.stringify(this.editGoods))
          this.$Message.success('产品修改成功！!')
          this.$parent.editState = false
        } else {
          this.$Message.error('产品修改失败！')
        }
      })
    },
    // 图片上传前
    uploadBefore (fileList) {
      const check = this.$refs.upload.fileList.length < 4
      if (!check) {
        this.$Notice.warning({
          title: '最多可上传4张图片！'
        })
      }
      return check
    },
    // 图片上传成功
    uploadSuccess (response, file, fileList) {
      this.uploadList.push(response.result)
      console.log(this.uploadList)
      this.$Message.success('图片上传成功！')
    },
    // 图片上传失败
    uploadError (error, file, fileList) {
      console.log(error)
      this.$Message.error('图片上传失败！')
    }
  }
}
</script>

<style scoped>
.code-row .ivu-col{
    margin-bottom: 16px;
}
.table{
    border:1px solid #dddee1;
    font-size: 12px;
}
.thead{
    background: #f8f8f9;
    font-weight: 700;
    line-height: 32px;
    text-align: center;
}
.ivu-modal{
  margin-bottom: 100px;
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
