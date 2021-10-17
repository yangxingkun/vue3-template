function round(val, v) {
  return val + v;
}
const store = {
  namespaced: true,
  state: {
    completeMachineHealthDegree: 1, // 整机健康度
    pressureHealthDegree: 1, // 液压系统健康度
    axletreeHealthDegree: 1, // 泵健康度
    gearboxHealthDegree: 1, // 齿轮箱健康度
  },
  getters: {
    pressureHealthDegree(state) {
      return round(state.pressureHealthDegree, 2);
    },
    axletreeHealthDegree(state) {
      return round(state.axletreeHealthDegree, 2);
    },
    gearboxHealthDegree(state) {
      return round(state.gearboxHealthDegree, 2);
    },
    completeMachineHealthDegree(state) {
      return round(state.completeMachineHealthDegree, 2);
    },
  },
  mutation: {
    // 健康度
    updateHealthDegree(state, { healthDegree, prop }) {
      debugger;
      state[prop] = healthDegree;
    },
  },
};
export default store;
