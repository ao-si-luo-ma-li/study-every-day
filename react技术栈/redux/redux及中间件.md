### Redux 详解
> Redux 是数据管理中心，全局的 data store 实例。通过一定规则和限制，保证数据的健壮性、和追溯性和可预测性

<b>核心理念</b>
* 单一数据源：
* 状态只读：
* 纯函数：

使用react-redux，将store与React组件连接
```
@connect(
  ()=> {}, // 将store通过mapStateToProps进行筛选后使用props注入组件
  {}        // 根据mapDispatchToProps创建方法，当组件调用时使用dispatch触发对应的action。如果是对象，其value是 actionCreater，自动封装 dispatch 方法
)
```

### 使用 React-redux
> UI 组件负责 UI 的呈现，容器组件负责管理数据和逻辑

React-Redux将所有组件分成两大类：
* UI 组件
  - 只负责UI的呈现，不带任何业务逻辑
  - 没有状态（即不实用this.state）
  - 所有数据都由参数（this.props）提供
  - 不使用任何Redux的API
* 容器组件
  - 负责管理数据和业务逻辑，不负责UI的呈现
  - 带有内部状态
  - 使用Redux的API

### Redux 配套中间件
```
import { createStore, applyMiddleware, compose } from 'redux';
// 做异步dispatch时使用，十分精妙
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension?window.devToolsExtension():f =>f
));
```

 + #### redux-saga
  + saga 的应用场景是复杂异步

  ```dva 就是应用了 react + redux-saga```
  
 + #### redux-thunk
  > redux-thunk最重要的思想，就是可以接受一个返回函数的action creator。如果这个action creator 返回的是一个函数，就执行它

  ```
  export function addCount() {
    return {type: ADD_COUNT}
  } 
  export function addCountAsync() {
    return dispatch => {
      setTimeout( () => {
        dispatch(addCount())
      },2000)
    }
  }
  ```
