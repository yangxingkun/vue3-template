<template>
  <div>
    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent, computed, onMounted } from "vue";
import { useStore } from "vuex";
export default defineComponent({
  name: "App",
  mounted() {
    const store = useStore();
    console.log("[ store ]", store);
    store.dispatch("m2/socketInit");
  },
  // setup() {
  //   onMounted(() => {
  //     console.log('[ store ]',store )
  //     store.dispatch('m2/socketInit')
  //   })
  //   return{
  //   }
  // }
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
a {
  color: #2c3e50;
  padding: 0 20px;
}
.links {
  text-align: center;
}
</style>
