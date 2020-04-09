// import  './index.scss';
import Vue from 'vue';
import  './mm.less';
import  './nn.css';
import App from './vue/App';


new Vue({
  render: h => h(App)
}).$mount('#app');

console.log('llll');
const kk = 99;
new Promise((r, j) => {
  r(99)
})
.then(res => {
  return res + 1
})
.then(res => {
  console.log(res);
})