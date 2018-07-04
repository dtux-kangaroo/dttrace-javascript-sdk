import uuid from './uuid';
import * as cookie from './cookie';
import {getSessionId} from './session';

const {screen,location,navigator}=window;

const getReferrerHost=(referrer)=>{
  const REG_TEST_REFERRER_LEGALITY=/:\/\/.*\//
  if(REG_TEST_REFERRER_LEGALITY.test(referrer)){
    return referrer.match(REG_TEST_REFERRER_LEGALITY)[0].replace(/(:\/\/)|(\/)/g,'')
  }
}


const getScreenInfo=()=>{
  return screen&&{
    '$screen_height':screen.height,
    '$screen_width':screen.width,
    '$screen_colordepth':screen.colorDepth
  }
}

const getLocationInfo=()=>{
  return location&&{
    '$url':location.href,
    '$url_path':location.pathname
  }
}

const getNavigatorInfo=()=>{
  return navigator&&{
    '$lang':navigator.language,
    '$user_agent':navigator.userAgent
  }
}

const getDocumentInfo=()=>{
  return document&&{
    '$title' : document.title,
    '$referrer':document.referrer,
    '$referrer_host':getReferrerHost(document.referrer),
    '$cookie':document.cookie
  }
}

const getAllInfo=()=>{
  return Object.assign({},getScreenInfo(),getLocationInfo(),getNavigatorInfo(),getDocumentInfo(),{
    '$sessionId':getSessionId()
  });
}

let DEFALUT_PARAMS=Object.assign({},getAllInfo(),{
  '$DTTID':uuid()
});


let DEFALUT_OPTIONS={
  url:'https://recvapi.md.dtstack.com/dta',
  session_expiration_time:30*60*1000,
  status:0
}

export const getDefaultParams=()=>{
  Object.assign(DEFALUT_PARAMS,getAllInfo());
  return DEFALUT_PARAMS;
}

export const setDefaultParams=(extraParams)=>{
  Object.assign(DEFALUT_PARAMS,extraParams);
  return DEFALUT_PARAMS;  
}

export const removeDefaultParams=(name)=>{
  const value=DEFALUT_PARAMS[name];
  delete DEFALUT_PARAMS[name];
  return value;
}

export const getDefaultOptions=()=>{
  return DEFALUT_OPTIONS;
}

export const setDefaultOptions=(options)=>{
  Object.assign(DEFALUT_OPTIONS,options);
  return DEFALUT_OPTIONS;
}