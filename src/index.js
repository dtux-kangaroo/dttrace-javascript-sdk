import * as cookie from './utils/cookie';
import {
  setDefaultParams,
  removeDefaultParams,
  getDefaultParams,
  setDefaultOptions
} from './utils/options';
import uuid from './utils/uuid';
import send from './utils/send';
import initialize from './utils/initialize';
import {
  eventInfoAnalyze
} from './utils/event';
//给事件进行埋点
const carryRocket =function(fun,params){
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
  console.error("Dttrace.carryRocket参数传递错误");
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

  if (checkArgsIntegrity(args).length > 0) {
    console.error('Dttrace initialize unsuccessfully,some required params no exist!');
    checkArgsIntegrity(args).forEach((item) => {
      console.error(item);
    });
  } else {
    if(sessionExpiration) setDefaultOptions({session_expiration:sessionExpiration});
    setDefaultParams(Object.assign({},{
      $app_key:appKey,
      $app_type:appType,
      $token:token
    },params));
    //初始化
    initialize();
  }

  function checkArgsIntegrity(args) {
    const {
      appKey,
      appType,
      token
    } = args;
    const errorList = [];
    if (!appKey) errorList.push('appKey no exist');
    if (!appType) errorList.push('appType no exist');
    if (!token) errorList.push('token no exist');
    return errorList;
  }
}

const launchRocket = (params,event) => {
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
  setDefaultParams,
  removeDefaultParams
}

export default Dttrace;