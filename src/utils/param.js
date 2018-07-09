import uuid from './uuid';
import {getSessionId} from './session';
import Option from './option';

const {screen,location,navigator}=window;

function getReferrerHost(referrer){
  const REG_TEST_REFERRER_LEGALITY=/:\/\/.*\//
  if(REG_TEST_REFERRER_LEGALITY.test(referrer)){
    return referrer.match(REG_TEST_REFERRER_LEGALITY)[0].replace(/(:\/\/)|(\/)/g,'')
  }
}

function getScreenInfo(){
  return screen&&{
    '$screen_height':screen.height,
    '$screen_width':screen.width,
    '$screen_colordepth':screen.colorDepth
  }
}

function getLocationInfo(){
  return location&&{
    '$url':location.href,
    '$url_path':location.pathname+location.hash
  }
}

function getNavigatorInfo(){
  return navigator&&{
    '$lang':navigator.language,
    '$user_agent':navigator.userAgent
  }
}

function getDocumentInfo(){
  return document&&{
    '$title' : document.title,
    '$referrer':document.referrer,
    '$referrer_host':getReferrerHost(document.referrer),
    '$cookie':document.cookie
  }
}


function getAllInfo(){
  return Object.assign({},getScreenInfo(),getLocationInfo(),getNavigatorInfo(),getDocumentInfo(),{
    '$session_id':getSessionId(),
    '$app_key':Option.get('appKey'),
    '$app_type':Option.get('appType'),
    '$token':Option.get('token')
  });
}


const DEFALUT_PARAMS=Object.assign({},getAllInfo(),{
  '$DTTID':uuid()
});


export default {
  get:(name)=>{
    Object.assign(DEFALUT_PARAMS,getAllInfo());
    if(name) return DEFALUT_PARAMS[name];
    return DEFALUT_PARAMS;
  },
  set:(params)=>{
    Object.assign(DEFALUT_PARAMS,params);
    return DEFALUT_PARAMS;
  },
  remove:(name)=>{
    Object.assign(DEFALUT_PARAMS,getAllInfo());
    const value = DEFALUT_PARAMS[name];
    return value;
  }
}