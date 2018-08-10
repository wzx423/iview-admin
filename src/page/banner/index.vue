<template>
    <div>
        <Card :bordered="true">
            <p slot="title">广告管理</p>
            <Row type="flex" justify="space-between" class="code-row">
                <div></div>
                <Col>
                    <Button type="info" @click="add_isShow = true">
                        <Icon type="plus-round" style="margin-right:10px;"></Icon>
                            添加广告
                    </Button>
                </Col>
            </Row>
            <Table border stripe :columns="columns" :data="bannerList" size="small" no-data-text="暂无数据" no-filtered-data-text="暂无筛选结果"></Table>
        </Card>
        <!-- 添加广告 -->
        <Modal title="添加广告" v-model="add_isShow" ok-text="保存" @on-ok="updateCategory" :loading="true" :mask-closable="false" :closable="false">
            <Form ref="newBanner" :model="newBanner" :label-width="80" >
                <FormItem label="广告类型" >
                    <Select v-model="newBanner.bannerType" placeholder="请选择广告分类">
                      <Option :value="0">首页轮播图</Option>
                      <Option :value="1">横幅广告</Option>
                      <Option :value="2">专区广告</Option>
                    </Select>
                </FormItem>
                <FormItem label="选择图片">
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
                              <Icon type="md-camera" size="20"></Icon>
                          </div>
                    </Upload>
                </FormItem>
                <FormItem label="跳转链接" prop="goodsPrice">
                    <Input v-model="newBanner.linkPath" placeholder="请输入跳转链接" clearable></Input>
                </FormItem>
                <FormItem label="排序号" prop="goodsPrice">
                    <Input v-model="newBanner.sortNum" placeholder="请输入排序号" clearable></Input>
                </FormItem>
                <FormItem label="是否显示">
                    <RadioGroup v-model="newBanner.isShow" >
                        <Radio :label="0">不显示</Radio>
                        <Radio :label="1">显示</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {getAds} from '@/utils/api'
export default {
  data () {
    return {
      bannerList: [],
      add_isShow: false,
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        }, {
          title: '广告类型',
          key: 'bannerType',
          maxWidth: 120,
          render: (h, params) => {
            let texts = ''
            this.bannerList.forEach(function (item, index, array) {
              switch (params.row.bannerType) {
                case 0:
                  texts = '首页轮播图'
                  break
                case 1:
                  texts = '横幅广告'
                  break
                case 2:
                  texts = '专区广告'
                  break
              }
            })
            return h('span', texts)
          }
        }, {
          title: '广告图片',
          key: 'imagesPath',
          maxWidth: 150,
          render: (h, params) => {
            return h('div', [
              h('img', {
                attrs: {
                  src: params.row.imagesPath
                },
                style: {
                  height: '32px',
                  lineHeight: '32px',
                  verticalAlign: 'top'
                }
              })
            ])
          }
        }, {
          title: '跳转链接',
          key: 'linkPath'
        }, {
          title: '是否显示',
          key: 'isShow',
          width: 86,
          align: 'center',
          render: (h, params) => {
            let texts = ''
            if (params.row.isShow === 0) {
              texts = '否'
            } else if (params.row.isShow === 1) {
              texts = '是'
            }
            return h('span', {
              props: {}
            }, texts)
          }
        }, {
          title: '排序号',
          key: 'sortNum',
          width: 80,
          align: 'center'
        }, {
          title: '创建时间',
          key: 'creamTime',
          align: 'center'
        }, {
          title: '操作',
          width: 125,
          align: 'center',
          render: (h, params) => {
            return h('div', [
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
                    this.editCategory = params.row
                    this.edit_isShow = true
                  }
                }
              }, '修改'),
              h('Button', {
                props: {
                  type: 'error',
                  size: 'small',
                  disabled: true
                },
                on: {
                  click: () => {
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      newBanner: {
        bannerType: 0,
        imagesPath: '',
        linkPath: '',
        isShow: 1,
        sortNum: 0
      }
    }
  },
  mounted () {
    this.adsGet()
  },
  methods: {
    async adsGet () {
      const ads = await getAds()
      this.bannerList = ads.result
    }
  }
}
</script>

<style scoped>
.code-row .ivu-col{
    margin-bottom: 16px;
}
</style>
