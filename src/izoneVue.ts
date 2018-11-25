const izoneVue: any = {};
izoneVue.install = (Vue: any, options: any) => {
  // 1. 添加全局方法或属性
  Vue.isDev = true
  // production
  // Vue.rootPath = '';
  // dev
  Vue.rootPath = 'http://localhost:8360'
  // Vue.myGlobalMethod = function () {
  //   // 逻辑...
  // }
  Vue.members = {
    圆: '🐰',
    樱: '🌸',
    柔: '🐹',
    椰: '🐥',
    安: '🐶',
    奈: '🐦',
    权: '🍊',
    惠: '🍴',
    仁: '🍓',
    彩: '🦄',
    珉: '🐸',
    燕: '💃',
  }


  // // 2. 添加全局资源
  // Vue.directive('my-directive', {
  //   bind (el, binding, vnode, oldVnode) {
  //     // 逻辑...
  //   }
  //   ...
  // })

  // // 3. 注入组件
  // Vue.mixin({
  //   created: function () {
  //     // 逻辑...
  //   }
  //   ...
  // })

  // // 4. 添加实例方法
  // Vue.prototype.$myMethod = function (methodOptions) {
  //   // 逻辑...
  // }
}
export default izoneVue;
