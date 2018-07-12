import send from './send';
import ready from './ready';
import {createDtSessionId} from './session';
import {eventInfoAnalyze} from './event';



// 添加监听事件
const addEventListener = (element, evType, fn, useCapture) => {
  if (element.addEventListener) {
    element.addEventListener(evType, fn, useCapture); //DOM2.0
    return true;
  } else if (element.attachEvent) {
    const r = element.attachEvent('on' + evType, fn);//IE5+
    return r;
  } else {
    element['on' + evType] = fn; //DOM 0
  }
}

export default () => {
  ready(()=>{
    const enter_time=new Date().getTime();
    //分配sessionId
    createDtSessionId();
    //监听页面进入
    const pageEnterHandler=()=>{
      send({
        $event_id:2001,
      }); 
    }

    if('onpageshow' in window){
      addEventListener(window,'pageshow',pageEnterHandler,false);
    }else{
      addEventListener(window,'load',pageEnterHandler,false);
    }

  
    //代理所有className为dttrace的dom元素
    const element_body = document.getElementsByTagName('body')[0];
    addEventListener(element_body, 'click',(arg_event)=>{
      const final_event = window.event || arg_event;
      const target_element =final_event.target||final_event.srcElement;
      if (target_element.className.indexOf('dttrace') > -1) {
        const params = {};
        Object.keys(target_element.dataset).filter(key => {
          if (key.indexOf('dttrace') > -1) {
            params[key.substring(7).toLocaleLowerCase()] = target_element.dataset[key];
          }
        });
        if(params.eventid){
          params.$event_id=params.eventid;
          delete params.eventid;
        } 
        send(Object.assign({},eventInfoAnalyze(final_event),params));
      }
    },false);

    //监听页面离开
    const pageLeaveHandler=()=>{
      const current_time = new Date().getTime(); 
      const $stay_time = current_time - enter_time;
      send({
        $event_id:2002,
        $stay_time
      });
    }

    if('onpagehide' in window){
      addEventListener(window,'pagehide',pageLeaveHandler,false);
    }else{
      addEventListener(window,'beforeunload',pageLeaveHandler,false);
    } 
  });
}