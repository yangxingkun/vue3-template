// import { useStore } from 'vuex'
import store from "../store"
const handleData = (data, commit) => {
  console.log('[ commit ]', commit)
    //   debugger;

// const store = useStore()

console.log('[ store ]---------', store)
  // data:{"code":"1","sessionId":"0beb2408643a4b37a68d8bae4baa846e"}
  data = {
    ...data,
    ...{
      // completeMachineHealthDegree: {
      //   message: {
      //     dataContent: [
      //       {
      //         health: "hjk",
      //       },
      //     ],
      //   },
      // },
      pressureHealthDegree: {
        message: {
          dataContent: [
            {
              health: "hjk",
            },
          ],
        },
      },
      axletreeHealthDegree: [],
      gearboxHealthDegree: [],
    },
  };

  // 当前任务
  const [b,c,task,d,e] = Object.keys(data);
  console.log("[ task ]", task);
  // 任务执行器
  const taskRunner = {
    healthRunner() {
      const {
        message: { dataContent },
      } = data[task];
      debugger;
      // 更新状态
      dataContent &&
      commit("m3/updateHealthDegree", {
          prop: task,
          healthDegree: dataContent[0].health,
          sessionId: data.sessionId
        },{root: true});
        // debugger;
;
    },
    defaultRunner(mutation) {
      const {
        message: { dataContent },
      } = data[task];
      // 更新状态
      dataContent && commit(mutation, dataContent);
    },
  };

  // 任务映射委托
  const taskMap = {
    // 健康度
    completeMachineHealthDegree() {
      taskRunner.healthRunner();
    },
    pressureHealthDegree() {
      taskRunner.healthRunner();
    },
    axletreeHealthDegree() {
      taskRunner.healthRunner();
    },
    gearboxHealthDegree() {
      taskRunner.healthRunner();
    },
  };

  // 执行任务
  if (task in taskMap) {
    taskMap[task]();
  }
};

export { handleData };
