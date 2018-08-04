<template>
    <div>
        <Card :bordered="true">
            <p slot="title">用户管理</p>
            <Row type="flex" justify="space-between" class="code-row">
                <Col>
                    <Input v-model="search_value" style="max-width:320px;">
                        <Select v-model="search_condition" slot="prepend" style="width: 80px">
                            <Option value="loginName">用户账号</Option>
                            <Option value="userName">用户姓名</Option>
                        </Select>
                        <Button slot="append" icon="ios-search" @click="searchUserData"></Button>
                    </Input>
                </Col>
            </Row>
            <Table border stripe :columns="columns" :data="userList" size="small" no-data-text="暂无数据" no-filtered-data-text="暂无筛选结果"></Table>
            <div style="padding-bottom:1px; margin-top:16px; overflow:hidden;">
                <Page style="float:right;" :total="userList.length" :page-size="30" size="small" show-total show-elevator ></Page>
            </div>
        </Card>
    </div>
</template>

<script>
import {getUser, searchUser, switchUser} from '@/utils/api'
export default {
  data () {
    return {
      search_value: '',
      search_condition: 'loginName',
      userList: [],
      columns: [
        {
          type: 'index',
          width: 60,
          align: 'center'
        },
        {
          title: '用户ID',
          key: 'userId',
          width: 80,
          align: 'center'
        },
        {
          title: '登录账号',
          key: 'loginName',
          minWidth: 120,
          ellipsis: true
        },
        {
          title: '登录密码',
          key: 'loginPwd',
          minWidth: 120,
          ellipsis: true
        },
        {
          title: '姓名',
          key: 'userName',
          minWidth: 100,
          ellipsis: true
        },
        {
          title: '性别',
          key: 'userSex',
          width: 64,
          align: 'center',
          render: (h, params) => {
            let texts = ''
            switch (params.row.userSex) {
              case 0:
                texts = '保密'
                break
              case 1:
                texts = '男'
                break
              case 2:
                texts = '女'
                break
            }
            return h('span', {
              props: {}
            }, texts)
          }
        },
        {
          title: '  等级',
          key: 'userLevel',
          width: 64,
          align: 'center',
          render: (h, params) => {
            let texts = ''
            switch (params.row.userLevel) {
              case 0:
                texts = '青铜'
                break
              case 1:
                texts = '白银'
                break
              case 2:
                texts = '黄金'
                break
              case 3:
                texts = '铂金'
                break
              case 4:
                texts = '钻石'
                break
            }
            return h('span', {
              props: {}
            }, texts)
          }
        },
        {
          title: '状态',
          key: 'userStatus',
          width: 70,
          align: 'center',
          render: (h, params) => {
            let texts = ''
            switch (params.row.userStatus) {
              case 0:
                texts = '禁用'
                break
              case 1:
                texts = '启用'
                break
            }
            return h('span', {
              props: {}
            }, texts)
          }
        },
        {
          title: '最后登录IP',
          minWidth: 100,
          key: 'lastIP'
        },
        {
          title: '最后登录时间',
          minWidth: 100,
          key: 'lastTime'
        },
        {
          title: '注册时间',
          minWidth: 100,
          key: 'createTime'
        },
        {
          title: '操作',
          width: 80,
          align: 'center',
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: params.row.userStatus === 0 ? 'success' : 'error',
                  size: 'small'
                },
                on: {
                  click: () => {
                    let data = {
                      userId: params.row.userId,
                      status: params.row.userStatus === 0 ? 1 : 0
                    }
                    this.switchUserData(data, params.index)
                  }
                }
              }, params.row.userStatus === 0 ? '启用' : '禁用')
            ])
          }
        }
      ]
    }
  },
  mounted () {
    this.getUserData()
  },
  methods: {
    // 获取用户数据
    async getUserData () {
      const user = await getUser()
      this.userList = user.result
    },
    // 搜索用户
    async searchUserData () {
      const result = await searchUser(this.search_condition + '=' + this.search_value)
      this.userList = result.result
    },
    // 禁用或启用账户
    async switchUserData (data, index) {
      const result = await switchUser(data)
      if (result.code === 0) {
        let str = data.status === 0 ? '账户禁用成功！' : '账户启用成功!'
        this.userList[index].userStatus = data.status
        this.$Notice.success({
          title: str
        })
      }
    }
  }
}
</script>

<style scoped>
.code-row .ivu-col{
    margin-bottom: 16px;
}
</style>
