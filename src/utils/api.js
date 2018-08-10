import axios from 'axios'

// axios.defaults.timeout = 5000
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencodedcharset=UTF-8'
axios.defaults.baseURL = 'http://192.168.10.185:3000/admin/'
// axios.defaults.baseURL = 'http://192.168.1.4:3000/admin/'

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  return config
}, function (error) {
  return Promise.reject(error)
})
// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  return response
}, function (error) {
  return Promise.reject(error)
})

export function fetch (url, params, type = 'get') {
  // console.log(params)
  params = JSON.stringify(params)
  if (type.toLowerCase() === 'post') {
    return new Promise((resolve, reject) => {
      axios.post(url, params).then(response => {
        // console.log(response.data)
        resolve(response.data)
      }, err => {
        reject(err)
      }).catch(error => {
        reject(error)
      })
    })
  }
  return new Promise((resolve, reject) => {
    axios.get(url).then(response => {
      resolve(response.data)
    }, err => {
      reject(err)
    }).catch(error => {
      reject(error)
    })
  })
}

export const getUser = () => fetch('/user/get')

export const searchUser = data => fetch('/user/search?' + data)

export const switchUser = data => fetch('/user/switch', data, 'post')

export const getGoods = index => fetch('/goods/get?page=' + index)

export const addGoods = data => fetch('/goods/add', data, 'post')

export const searchGoods = data => fetch('/goods/search?' + data)

export const getCategory = () => fetch('/category/get')

export const addCategory = data => fetch('/category/add', data, 'post')

export const updateCategory = data => fetch('/category/update', data, 'post')

export const getAds = () => fetch('/ads/get')

export const updateFile = data => fetch('/upload', data, 'post')
