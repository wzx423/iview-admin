<template>
    <div class="layout">
        <Layout>
            <Header :style="{padding: 0,display:'flex',justifyContent:'space-between',zIndex: 99}" class="layout-header-bar">
                <div>
                    <Icon @click.native="collapsedSider" :class="rotateIcon" :style="{margin: '10px 10px 0',padding:'10px'}" type="navicon-round" size="24" />
                </div>
                <!-- <div class="layout-logo">logo</div> -->
                <Breadcrumb style="flex-grow:1;">
                     <BreadcrumbItem to="/">首页</BreadcrumbItem>
                </Breadcrumb>
                <div class="user">
                    <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                        <Dropdown transfer trigger="click">
                            <a href="javascript:void(0)">
                                <span class="main-user-name">admin</span>
                                <Icon type="arrow-down-b" />
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="ownSpace">个人中心</DropdownItem>
                                <DropdownItem name="password">修改密码</DropdownItem>
                                <DropdownItem name="loginout" divided>退出登录</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Avatar src="https://i.loli.net/2017/08/21/599a521472424.jpg" style="background: #619fe7;margin-left: 10px;"></Avatar>
                    </Row>
                </div>
            </Header>
            <Layout :style="{width:'100vw',height:'100vh',paddingBottom:'64px',position:'relative'}">
                <Sider ref="side1" hide-trigger collapsible :collapsed-width="78" v-model="isCollapsed" :style="{overflowY:'auto'}">
                    <Menu theme="dark" width="auto" @on-select="openPath" :class="menuitemClasses">
                        <MenuItem name="User">
                            <Icon type="ios-person" />
                            <span>用户管理</span>
                        </MenuItem>
                        <MenuItem name="Goods">
                            <Icon type="nuclear" />
                            <span>产品管理</span>
                        </MenuItem>
                        <MenuItem name="Category">
                            <Icon type="grid" />
                            <span>分类管理</span>
                        </MenuItem>

                    </Menu>
                </Sider>
                <Content :style="{width:'100%', height: '100%',overflowY:'auto'}">
                    <div :style="{padding: '20px',margin:'0 auto',overflow:'hidden'}">
                        <router-view/>
                    </div>
                </Content>
            </Layout>
        </Layout>
    </div>
</template>
<script>
export default{
  data () {
    return {
      isCollapsed: false
    }
  },
  computed: {
    rotateIcon () {
      return [
        'menu-icon',
        this.isCollapsed ? 'rotate-icon' : ''
      ]
    },
    menuitemClasses () {
      return [
        'menu-item',
        this.isCollapsed ? 'collapsed-menu' : ''
      ]
    }
  },
  methods: {
    collapsedSider () {
      this.$refs.side1.toggleCollapse()
    },
    openPath (name) {
      this.$router.push({name: name})
    }
  }
}
</script>

<style scoped>
    .layout{
        border: 1px solid #d7dde4;
        background: #f5f7f9;
        position: relative;
        border-radius: 4px;
        overflow: hidden;
        height: 100vh;
    }
    .layout-header-bar{
        border-bottom: 1px solid #d7dde4;
        box-shadow: 0 1px 1px rgba(0,0,0,.1);
    }
    .layout-logo-left{
        width: 90%;
        height: 30px;
        background: #5b6270;
        border-radius: 3px;
        margin: 15px auto;
    }
    .menu-icon{
        transition: all .3s;
    }
    .rotate-icon{
        transform: rotate(-90deg);
    }
    .menu-item span{
        display: inline-block;
        overflow: hidden;
        width: 69px;
        text-overflow: ellipsis;
        white-space: nowrap;
        vertical-align: bottom;
        transition: width .2s ease .2s;
    }
    .menu-item i{
        transform: translateX(0px);
        transition: font-size .2s ease, transform .2s ease;
        vertical-align: middle;
        width: 20px;
        text-align: center;
        font-size: 16px;
    }
    .collapsed-menu span{
        width: 0px;
        transition: width .2s ease;
    }
    .collapsed-menu i{
        transform: translateX(5px);
        transition: font-size .2s ease .2s, transform .2s ease .2s;
        vertical-align: middle;
        font-size: 22px;
    }
    .ivu-menu-vertical.collapsed-menu .ivu-menu-item, .ivu-menu-vertical.collapsed-menu .ivu-menu-submenu-title{
        padding:14px 20px;
        text-align: center;
    }
    .layout-logo{
        line-height: 64px;
        text-align: center;
        font-size: 18px;
    }
    .user{
        float: right;
        margin-right:40px;
    }
</style>
