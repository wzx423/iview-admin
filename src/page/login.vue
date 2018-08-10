<template>
    <Card :bordered="false" class="login">
        <p slot="title">xx商城后台管理系统</p>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
            <FormItem label="用户名" prop="username">
                <Input v-model="formValidate.username" placeholder="输入用户名" />
            </FormItem>
            <FormItem label="密码" prop="password">
                <Input v-model="formValidate.password" placeholder="输入密码" />
            </FormItem>
            <Button type="primary" @click="handleSubmit('formValidate')">登录</Button>
        </Form>
    </Card>
</template>

<script>
import {mapState, mapActions} from 'vuex'
// import {set, get} from '../utils/auth.js'
export default{
  computed: {
    ...mapState([
      'token',
      'userInfo'
    ])
  },
  data () {
    return {
      formValidate: {
        username: '',
        password: ''
      },
      ruleValidate: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', message: 'Incorrect password format', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
  },
  methods: {
    ...mapActions([
      'setToken'
    ]),
    handleSubmit (name) {
      // const _this = this
      this.$refs[name].validate((valid) => {
        if (valid) {
          this.$http.post('http://192.168.10.185:3000/api/user/login', JSON.stringify(this.formValidate)).then((response) => {
            if (response.status === 200) {
              console.log(response)
              this.setToken(response.data[0])
              this.$Message.success('Success!')
              this.$router.pusp('/')
            }
          }).catch((error) => {
            console.log(error)
          })
        } else {
          this.$Message.error('Fail!')
        }
      })
    }
  }
}
</script>

<style scoped>
.login{
    width: 360px;
    margin:180px auto;
}
</style>
