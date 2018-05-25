import uuid from './uuid';

const getWindowInfo=()=>{
  return window && window.screen&&{
    "sh":window.screen.height || 0,
    "sw":window.screen.width || 0,
    "cd":window.screen.colorDepth || 0,
  }
}

const getNavigatorInfo=()=>{
  return navigator&&{
    "lang":navigator.language || '',
    "platform":navigator.platform || ''
  }
}

const getDocumentInfo=()=>{
  return document&&{
    "url" : document.URL || '',
    "title" : document.title || '',
    "referrer":document.referrer || '',
    "cookie":document.cookie||''
  }
}

const extraInfo={
  "uuid":uuid(),
}

let DEFALUT_PARAMS=Object.assign({},getWindowInfo(),getNavigatorInfo(),getDocumentInfo(),extraInfo);


let DEFALUT_OPTIONS={
  url:''
}

export const getDefaultParams=()=>{
  Object.assign(DEFALUT_PARAMS,getWindowInfo(),getNavigatorInfo(),getDocumentInfo());
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
  if(options.params){
    setDefaultParams(options.params);
    delete options.params;
  }
  Object.assign(DEFALUT_OPTIONS,options);
  return DEFALUT_OPTIONS;
}