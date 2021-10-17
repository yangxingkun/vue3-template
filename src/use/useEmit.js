import { useStore } from "vuex";

function useEmit(params) {
  const store = useStore();
  //   console.log("[ store ]", store.state.m2.ws);
  const ws = store.state.m2.ws;
  const data = {
    msgContent: `${JSON.stringify(params)}`,
    postsId: 1,
  };
  ws.emit(data);
}

export default useEmit;
