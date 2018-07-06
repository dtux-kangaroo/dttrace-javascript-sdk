import Option from './utils/option';
import Param from './utils/param';
import send from './utils/send';
import initialize from './utils/initialize';
import {
  eventInfoAnalyze
} from './utils/event';


function carryRocket(fun,params){
  if(typeof fun === 'function'){
    let total = fun.length
    let current = 0
    const argsArray = []
    while (current < total) {
      argsArray.push('arg' + current)
      current++
    }
    return function(...argsArray){
      const final_event = window.event ? window.event : arg0;
      const result=fun.apply(this,argsArray);
      send(Object.assign({}, eventInfoAnalyze(final_event), Object.assign({$trigger_type:'action'},params),result))
    }
  }
  console.error(new Error("first param in Dttrace.carryRocket must be function"));
}

//DtaRocket注解
function DttraceRocket(params) {
  return (target, name, descriptor) => { 
    target[name]=carryRocket(target[name],params);
    return target;
  }
}

// 初始化
const init = (args) => {
  const {
    appKey,
    appType,
    token,
    sessionExpiration,
    params
  } = args;

  try{
    if (!appKey) throw new Error('appKey no exist');
    if (!appType) throw new Error('appType no exist');
    if (!token) throw new Error('token no exist');
  }catch(err){
    Option.set({status:0});
    console.error(err);
  }

  if(Option.get('status')){
    let final_option={
      appKey,
      appType,
      token
    }
    if(sessionExpiration) Object.assign(final_option,{session_expiration:sessionExpiration});
    Option.set(final_option);
    Param.set(params);
    //初始化
    initialize();
  }
}

function launchRocket(params,event){
  const final_params= params;
  if(event){
    Object.assign(final_params,eventInfoAnalyze(event));
  }
  send(final_params);
}


const Dttrace={
  init,
  launchRocket,
  carryRocket,
  DttraceRocket,
  Param
}

export default Dttrace;