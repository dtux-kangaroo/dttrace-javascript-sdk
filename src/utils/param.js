import uuid from './uuid';
import {getDtSessionId} from './session';
import Cookie from './cookie';
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

function getDTTID(){
  let $DTTID=localStorage?localStorage.getItem('$DTTID'):Cookie.get('$DTTID');
  if(!$DTTID){
    $DTTID=uuid();
    Cookie.set('$DTTID',$DTTID,1000*60*60*24*30*6);
    localStorage&&localStorage.setItem('$DTTID',$DTTID);
  }
  return $DTTID;
}


function getPresetParams(){
  const userId=(()=>{
    const getUserId=Option.get('getUserId');
    if(typeof getUserId === 'function'){
      return getUserId();
    }
    return;
  })();
  const sessionId=(()=>{
    const getSessionId=Option.get('getSessionId');
    if(typeof getSessionId === 'function'){
      return getSessionId();
    }
    return;
  })();
  return Object.assign({},getScreenInfo(),getLocationInfo(),getNavigatorInfo(),getDocumentInfo(),{
    '$dtsession_id':getDtSessionId(),
    '$app_key':Option.get('appKey'),
    '$DTTID':getDTTID(),
    '$user_id':userId,
    '$session_id':sessionId,
    'is_debug':Option.get('debug')
  });
}


const DEFALUT_PARAMS={};



export default {
  get:(name)=>{
    const params=Object.assign({},getPresetParams(),DEFALUT_PARAMS);
    if(name) return params[name];
    return params;
  },
  set:(params)=>{
    return Object.assign(DEFALUT_PARAMS,params);
  },
  remove:(name)=>{
    const value = DEFALUT_PARAMS[name];
    delete DEFALUT_PARAMS[name];
    return value;
  }
}