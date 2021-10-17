<template>
  <div>socket</div>
</template>
<script>
import { defineComponent, onMounted, ref ,watch} from "vue";
// import HelloWorld from '../../components/HelloWorld.vue'
import useEmit from "../../use/useEmit";
import { useStore } from "vuex";

export default defineComponent({
  name: "socket",
  //   components: {
  //     HelloWorld,
  //   },
  setup: () => {
    const store = useStore();
    console.log("[ storesocket ]", store.state.m2.ws);
    // debugger
    watch(
     [() => store.state.m2.pressureHealthDegree],
      (val,oldval) => {
        console.log("监听值刷新页面中的websoket",val);
      }
    );
    onMounted(() => {
      const params = {
        msgId: () => store.state.m2.sessionId,
        success: true,
        sessionId: "sessionId",
      };
      useEmit(params);
    });
  },
});
</script>



