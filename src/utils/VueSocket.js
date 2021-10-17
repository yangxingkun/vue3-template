class VueSocket {
    /**
     * VueSocket构造器
     * @param {string} url socket服务器URL
     * @param {function} commit Vuex中的commit函数，提交mutation触发全局状态变更
     * @param {function} handleData 数据分发处理函数，根据订阅将数据分发给不同的任务处理
     */
    constructor(url, commit, handleData = null) {
      this.url = url // socket连接地址
      this.commit = commit
      debugger
      this.distributeData = handleData
      this.sessionId=null

      this.ws = null // 原生WebSocket对象
      this.heartbeatTimer = null
      this.errorResetTimer = null // 错误重连轮询器
      this.disconnectSource = '' // 断开来源: 'close' 由close事件触发断开, 'error'由error事件触发断开
      this.reconnectNumber = 0 // 重连次数
      this.errorDispatchOpen = true // 开启错误调度
      this.closeSocket = false // 是否关闭socket
      this.init()
    }
  
    /**
     * 错误调度
     * @param {string} type 断开来源=> 'close' | 'error'
     * @returns {function}
     */
    static errorDispatch(type) {
      return () => {
        if (this.disconnectSource === '' && this.errorDispatchOpen) {
          this.disconnectSource = type
        }
  
        console.log(`[Disconnected] WebSocket disconnected from ${type} event`)
  
        // socket断开处理(排除手动断开的可能)
        if (this.disconnectSource === type && !this.closeSocket) {
          this.errorResetTimer && clearTimeout(this.errorResetTimer)
          VueSocket.handleDisconnect()
        }
      }
    }
  
    /**
     * 断开处理
     * @returns {undefined}
     */
    static handleDisconnect() {
      // 重连超过4次宣布失败
      if (this.reconnectNumber >= 4) {
        this.reconnectNumber = 0
        this.disconnectSource = ''
        this.errorResetTimer = null
        this.errorDispatchOpen = false
        this.ws = null
        console.log('[failed] WebSocket connect failed')
        return
      }
      // 重连尝试
      this.errorResetTimer = setTimeout(() => {
        this.init()
        this.reconnectNumber++
        console.log(`[socket reconnecting ${this.reconnectNumber} times...]`)
      }, this.reconnectNumber * 1000)
    }
  
    /**
     * 事件轮询器
     * @param {function} event 事件
     * @param {number|string} outerConditon 停止条件
     * @param {number} time
     * @param {function} callback
     */
    static eventPoll(event, outerConditon, time, callback) {
      let timer
      let currentCondition
      timer = clearInterval(() => {
        if (currentCondition === outerConditon) {
          clearInterval(timer)
          callback && callback()
        }
        currentCondition = event()
      }, time)
    }
  
    /**
     * 初始化连接，开始订阅消息
     * @param {function} callback
     */
    init(callback) {
      // 如果已经手动关闭socket，则不允许初始化
      if (this.closeSocket) {
        throw new Error('[Error] WebSocket has been closed.')
      }
  
      // 清除心跳检测计时器
      this.heartbeatTimer && clearTimeout(this.heartbeatTimer)
      this.ws = new WebSocket(this.url)
  
      this.ws.onopen = () => {
        callback && callback()
        this.reconnectNumber = 0
        this.disconnectSource = ''
        this.errorResetTimer = null
        this.errorDispatchOpen = true
        // 订阅消息
        this.subscribe()
        // 开启心跳侦测
        this.heartbeatDetect()
        console.log('[Open] Connected')
      }
  
      this.ws.onclose = VueSocket.errorDispatch('close')
      this.ws.onerror = VueSocket.errorDispatch('error')
    }
  
    /**
     * 订阅器
     */
    subscribe() {
      this.ws.onmessage = (res) => {
        if (res.data) {
          debugger
          this.sessionId=res.data.sessionId;
          this.commit('m2/sessionId', this.sessionId)
          const data = JSON.parse(res.data)
          // 根据任务类型，分发数据
          try {
            this.distributeData && this.distributeData(data, this.commit)
          } catch (e) {
            console.log(e)
          }
        }
        // 收到消息关闭上一个心跳定时器并启动新的定时器
        this.heartbeatDetect()
      }
    }
  
    /**
     * 发布器（组件发消息的）
     * @param {String} data
     * @param {Function} callback
     */
    emit(data, callback) {
      const state = this.getSocketState()
      debugger
      if (state === this.ws.OPEN) {

        this.ws.send(JSON.stringify(data))
        callback && callback()
        this.heartbeatDetect()
      } else if (state === this.ws.CONNECTING) {
        // 连接中轮询
        VueSocket.eventPoll(state, this.ws.OPEN, 500, () => {
          this.ws.send(JSON.stringify(data))
          callback && callback()
          this.heartbeatDetect()
        })
      } else {
        this.init(() => {
          this.emit(data, callback)
        })
      }
    }
  
    /**
     * 心跳侦测
     */
    heartbeatDetect() {
      this.heartbeatTimer && clearTimeout(this.heartbeatTimer)
      this.heartbeatTimer = setTimeout(() => {
        const state = this.getSocketState()
        if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) {
          // 发送心跳
          // this.ws.send('ping')
          this.ws.send(JSON.stringify({ data: 'heartBeat', sessionId: this.sessionId }))
        } else {
          this.init()
        }
      }, 50000)
    }
  
    /**
     * 手动关闭连接
     */
    close() {
      this.heartbeatTimer && clearTimeout(this.heartbeatTimer)
      this.errorResetTimer && clearTimeout(this.errorResetTimer)
      this.closeSocket = true
      this.ws.close()
    }
    /**
     * 手动连接
     */
    open() {
      if (!this.closeSocket) {
        throw new Error('[Error] WebSocket is connected')
      }
      this.heartbeatTimer = null
      this.reconnectNumber = 0
      this.disconnectSource = 0
      this.errorResetTimer = null
      this.errorDispatchOpen = true
      this.closeSocket = false
      this.init()
    }
  
    /**
     * 获取当前socket状态
     */
    getSocketState() {
      return this.ws.readyState
    }
  }
  
  export default VueSocket
  
  