<template>
    <div>
        <Card :bordered="true">
            <p slot="title">分类管理</p>
            <Row type="flex" justify="space-between" class="code-row">
                <div></div>
                <Col>
                    <Button type="info" @click="add_isShow = true">
                        <Icon type="plus-round" style="margin-right:10px;"></Icon>
                        添加分类
                    </Button>
                </Col>
            </Row>
            <Table border stripe :columns="columns" :data="typeList" size="small" no-data-text="暂无数据" no-filtered-data-text="暂无筛选结果"></Table>
            <div style="padding-bottom:1px; margin-top:16px; overflow:hidden;">
                <Page style="float:right;" :total="typeList.length" :page-size="30" size="small" show-total show-elevator ></Page>
            </div>
        </Card>
        <!-- 新增分类 -->
        <Modal title="新增分类" v-model="add_isShow" ok-text="保存" @on-ok="validateCategory('newCategory')" :loading="true">
            <Form ref="newCategory" :model="newCategory" :rules="ruleCategory" :label-width="80" >
                <FormItem label="分类名称" prop="typeName">
                    <Input v-model="newCategory.typeName" placeholder="请输入分类名称"/></Input>
                </FormItem>
                <FormItem label="父级分类" prop="parentId">
                    <Select v-model="newCategory.parentId" placeholder="请选择父级分类">
                      <Option :value="0">一级分类</Option>
                      <Option v-for="(item, index) in parentList" :value="item.typeId" :key="index">{{item.typeName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序号" prop="typeSort">
                    <Input v-model="newCategory.typeSort" placeholder="请输入排序号"></Input>
                </FormItem>
                <FormItem label="是否显示" prop="isShow">
                    <RadioGroup v-model="newCategory.isShow">
                        <Radio :label="0">不显示</Radio>
                        <Radio :label="1">显示</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
        <!-- 修改分类 -->
        <Modal title="修改分类" v-model="edit_isShow" ok-text="保存" @on-ok="updateCategory" :loading="true" :mask-closable="false" :closable="false">
            <Form ref="editCategory" :model="editCategory" :label-width="80" >
                <FormItem label="分类名称">
                    <Input v-model="editCategory.typeName" placeholder="请输入分类名称"></Input>
                </FormItem>
                <FormItem label="父级分类" >
                    <Select v-model="editCategory.parentId" placeholder="请选择父级分类">
                      <Option :value="0">一级分类</Option>
                      <Option v-for="(item, index) in parentList" :value="item.typeId" :key="index">{{item.typeName}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="排序号">
                    <Input v-model="editCategory.typeSort" placeholder="请输入排序号"></Input>
                </FormItem>
                <FormItem label="是否显示">
                    <RadioGroup v-model="editCategory.isShow" >
                        <Radio :label="0">不显示</Radio>
                        <Radio :label="1">显示</Radio>
                    </RadioGroup>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>

<script>
import {getCategory, addCategory, updateCategory} from '@/utils/api'
export default {
  data () {
    return {
      typeList: [],
      parentList: [],
      add_isShow: false,
      newCategory: {
        typeName: '',
        parentId: 0,
        typeSort: 0,
        isShow: 1
      },
      edit_isShow: false,
      editCategory: {},
      columns: [
        {
          title: '分类ID',
          key: 'typeId',
          width: 80,
          align: 'center'
        },
        {
          title: '分类名称',
          key: 'typeName',
          minWidth: 120
        },
        {
          title: '分类名称',
          key: 'parentId',
          minWidth: 120,
          render: (h, params) => {
            let texts = '一级分类'
            this.parentList.forEach(function (item, index, array) {
              if (params.row.parentId === item.typeId) {
                texts = item.typeName
              }
            })
            return h('span', texts)
          }
        },
        {
          title: '是否显示',
          key: 'isShow',
          width: 100,
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
        },
        {
          title: '排序号',
          key: 'typeSort',
          width: 90,
          sortable: true
        },
        {
          title: '创建时间',
          key: 'createTime',
          minWidth: 120,
          sortable: true,
          render: (h, params) => {
            return h('span', this.formatTime(params.row.createTime))
          }
        },
        {
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
                    this.remove(params.index)
                  }
                }
              }, '删除')
            ])
          }
        }
      ],
      ruleCategory: {
        typeName: [
          {required: true, message: '请输入分类名称！'}
        ],
        parentId: [
          {required: true, message: '请选择父级分类！'}
        ],
        typeSort: [
          {required: true, message: '请输入排序号！'}
        ],
        isShow: [
          {required: true, message: '请选择是否显示！'}
        ]
      }
    }
  },
  computed: {
  },
  mounted () {
    this.getData()
  },
  methods: {
    // 获取分类
    async getData () {
      const data = await getCategory()
      this.typeList = data.result
      this.parentList = data.result.filter(function (item, index, array) {
        return item.parentId === 0
      })
    },
    // 验证分类信息
    validateCategory (name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.addNewCategory(this.newCategory)
        } else {
          this.$message.error('分类信息不完整！')
        }
      })
    },
    // 添加分类
    async addNewCategory (data) {
      const result = await addCategory(data)
      console.log(result)
      if (result.code === 0) {
        this.$Notice.success({
          title: result.message
        })
        this.add_isShow = false
      } else {
        this.$Notice.error({
          title: '分类添加失败！'
        })
      }
    },
    remove (index) {
      this.$Modal.confirm({
        title: '删除分类',
        content: `<p>分类名称：${this.typeList[index].typeName}</p>`,
        onOk: () => {
        },
        onCancel: () => {
        }
      })
    },
    async updateCategory () {
      const result = await updateCategory(this.editCategory)
      if (result.code === 0) {
        this.$Notice.success({
          title: result.message
        })
        this.edit_isShow = false
      } else {
        this.$Notice.error({
          title: '分类修改失败！'
        })
      }
    },
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
    }
  }
}
</script>

<style scoped>
.code-row .ivu-col{
    margin-bottom: 16px;
}
</style>
