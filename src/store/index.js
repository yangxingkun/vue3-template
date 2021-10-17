import { createStore } from 'vuex'
import module1 from './modules/module1'
import module2 from './modules/module2'
import module3 from './modules/module3'
console.log('[ module3 ]', module3)
// Create a new store instance.
const store = createStore({
  // ...module3,
  modules: {
    m1:module1,
    m2:module2,
    m3:module3,
  },
})

export default store
