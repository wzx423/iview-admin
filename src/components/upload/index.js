import upload from './upload'
const Upload = {}
Upload.install = (Vue,options) => {
  const promptTpl = Vue.extend(prompt)
  let $vm, instance, timer = null;
  const init = () => {
    $vm = new promptTpl();
    let tpl = $vm.$mount().$el;
    document.querySelector('.page').appendChild(tpl);
    instance = true;
  }
  Vue.prototype.$Upload = {
    show (options) {
      clearTimeout(timer);
      if (!instance) {
        init();
      }
      if (typeof options === 'string') {
        $vm.text = options;
      } else if (typeof options === 'object') {
        Object.assign($vm, options);
      }
      $vm.show = true;
      timer = setTimeout(() => {
  	    $vm.show = false;
  	  }, $vm.time)
    },
    hide () {
      $vm.show = false;
    }
  }
}
export default Prompt;