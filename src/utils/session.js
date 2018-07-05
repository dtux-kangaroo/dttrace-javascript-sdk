import {getDefaultOptions} from  './options';
import * as cookie from './cookie';
import uuid from './uuid';

const {localStorage}=window;

export const createSessionId = ()=>{
 
  const {session_expiration} = getDefaultOptions();
  if(document.referrer===''||document.referrer.indexOf(location.host)<0){
    const sessionId =uuid();
    cookie.set('DTTRACE_SESSIONID',sessionId,session_expiration);
    localStorage.setItem('DTTRACE_SESSIONID',sessionId)
  }
}

export const getSessionId=()=>{
  if(cookie.get('DTTRACE_SESSIONID')) return cookie.get('DTTRACE_SESSIONID');
  if(localStorage.getItem('DTTRACE_SESSIONID')) return localStorage.getItem('DTTRACE_SESSIONID');
}