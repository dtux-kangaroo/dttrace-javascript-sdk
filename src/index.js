import * as cookie from './utils/cookie'
import * as options from './utils/options'
import uuid from './utils/uuid'
import send from './utils/send'
import initialize from './utils/initialize'
//给事件进行埋点
const carryRocket=(fun,params)=>{
  let total=fun.length
  let current=0
  const argsArray=[]
  while(current<total){
    argsArray.push("params"+current)
    current++
  }
  return (...argsArray)=>{
    send(params)
    fun(...argsArray)
  }
}
//初始化
initialize()
export default {
  cookie,
  options,
  uuid,
  launchRocket:send,
  carryRocket
}
