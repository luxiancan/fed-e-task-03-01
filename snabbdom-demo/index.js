let snabbdom = require('snabbdom');
let patch = snabbdom.init([ // Init patch function with chosen modules
  require('snabbdom/modules/class').default, // makes it easy to toggle classes
  require('snabbdom/modules/props').default, // for setting properties on DOM elements
  require('snabbdom/modules/style').default, // handles styling on elements with support for animations
  require('snabbdom/modules/eventlisteners').default, // attaches event listeners
]);
let h = require('snabbdom/h').default; // helper function for creating vnodes

// 页面容器
let container = document.getElementById('container');

// 原始数据
let data = new Array(10).fill(0).map((_, i) => i).map(index => ({
  index,
  content: '-' + index + '--' + randomString(20) + '_lxcan',
  time: Date.now()
}));

// 保存 vnode
let vnode = initVnode(data);

// 首次渲染
patch(container, vnode);

// 得到页面需要渲染的 vnode
function initVnode (data) {
  return h('div.wrap', {
    style: {
      width: '600px',
      margin: '50px auto',
      padding: '20px',
      border: '1px solid #000'
    }
  }, [
    h('header.header-wrap',  [
      h('button', { style: { 'margin-right': '10px' }, on: { click: [changeSort, 'order'] } }, '顺序排列'),
      h('button', { style: { 'margin-right': '10px' }, on: { click: [changeSort, 'reorder'] } }, '倒序排列'),
      h('button', { style: { 'margin-right': '10px' }, on: { click: [changeSort, 'random'] } }, '随机排列'),
      h('button', { on: { click: addItem } }, '添加1项')
    ]),
    h('table', [
      h('tr', [
        h('th', '序号'),
        h('th', '内容'),
        h('th', '添加时间')
      ]),
      h('tbody', data.map(getTrVnode))
    ])
  ]);
}

// 获取表格行的 vnode
function getTrVnode(item) {
  return h('tr', [
    h('td', item.index),
    h('td', item.content),
    h('td', item.time)
  ])
}

// 点击按钮，改变排序
function changeSort (type) {  
  if (type === 'order') {
    // 顺序排列
    data.sort((a, b) => a.index - b.index);
  } else if (type === 'reorder') {
    // 倒序排列
    data.sort((a, b) => b.index - a.index);
  } else if (type === 'random') {
    // 随机排列
    data.sort(() => Math.random() > 0.5 ? -1 : 1)
  }
  render(data);
}

// 添加一项
function addItem () {
  const total = data.length;
  const item = {
    index: total,
    content: '-' + total + '--' + randomString(20) + '_lxcan',
    time: Date.now()
  };
  data.unshift(item);
  render(data);
}

// 数据改变，再次渲染
function render (data) {
  vnode = patch(vnode, initVnode(data))
}

// 辅助函数，获取随机字符串
function randomString(len) {
  len = len || 32;
  var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
  var maxPos = $chars.length;
  var pwd = '';
  for (i = 0; i < len; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
