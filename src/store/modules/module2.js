import VueSocket from "@/utils/VueSocket";
// import { round } from '@/use/useToolFunction'
import { handleData } from "@/utils/handleSocketData"; // 分发任务的关键函数
import { WEBSOCKET } from "@/config"; // 导出一个常量

// const debug = import.meta.env.MODE.startsWith('dev')
console.log(
  "[ import.meta.env.VITE_APP_SOCKET ]",
  import.meta.env.VITE_APP_SOCKET
);
// debugger;
const store = {
  namespaced: true,
  state: {
    ws: null, // websorket实例
    pressureHealthDegree: null,
    sessionId: null,
  },
  mutations: {
    // 初始化socket连接
    createSocket(state, { commit }) {
      const baseURL = `${import.meta.env.VITE_APP_SOCKET}?terminalCode=${
        WEBSOCKET.TARGET
      }`;
      // console.log("[WEBSOCKET  ]", WEBSOCKET.TARGET);
      state.ws = new VueSocket(baseURL, commit, handleData);
    },
    updateHealthDegree(state, { healthDegree, prop, sessionId }) {
      state[prop] = healthDegree;
      state[sessionId] = sessionId;
    },
    sessionId(state, sessionId) {
      sessionId["sessionId"] = sessionId;
    },
  },
  actions: {
    // 创建实例
    socketInit({ commit }) {
      commit("createSocket", { commit });
    },
  },
  // debug console
  // plugins: debug ? [createLogger()] : [],
};

export default store;
