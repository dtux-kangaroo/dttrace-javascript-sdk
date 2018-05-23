

const windowInfo=window && window.screen&&{
  "sh":window.screen.height || 0,
  "sw":window.screen.width || 0,
  "cd":window.screen.colorDepth || 0,
}

const navigatorInfo=navigator&&{
  "lang":navigator.language || '',
  "platform":navigator.platform || ''
}
const documentInfo=document&&{
  "url" : document.URL || '',
  "title" : document.title || '',
  "referrer":document.referrer || '',
  "cookie":JSON.stringify(document.cookie)||''
}

let DEFALUT_PARAMS=Object.assign({},windowInfo,navigatorInfo,documentInfo);


let DEFALUT_OPTIONS={
  url:'http://recv.log.dtstack.com/dtas'
}

export const getDefaultParams=()=>{
  return DEFALUT_PARAMS;
}

export const setDefaultParams=(extraParams)=>{
  DEFALUT_PARAMS=Object.assign(DEFALUT_PARAMS,extraParams);
  return DEFALUT_PARAMS;  
}

export const getDefaultOptions=()=>{
  return DEFALUT_OPTIONS;
}

export const setDefaultOptions=(options)=>{
  if(options.params){
    setDefaultParams(options.params);
    delete options.params;
  }
  DEFALUT_OPTIONS=Object.assign(DEFALUT_OPTIONS,options);
  return DEFALUT_OPTIONS;
}