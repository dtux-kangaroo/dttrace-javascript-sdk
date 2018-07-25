import Option from  './option';
import cookie from './cookie';
import uuid from './uuid';

const {localStorage}=window;

export const createDtSessionId = (sessionId)=>{
  const {session_expiration} = Option.get();
  if(document.referrer===''||document.referrer.indexOf(location.host)<0){
    cookie.set('DTTRACE_SESSIONID',sessionId,session_expiration);
    localStorage.setItem('DTTRACE_SESSIONID',sessionId);
    localStorage.setItem('DTTRACE_SESSIONID_EXPIRE',new Date().getTime()+session_expiration);
  }
}

export const getDtSessionId=()=>{
  if(cookie.get('DTTRACE_SESSIONID')) return cookie.get('DTTRACE_SESSIONID');
  if(localStorage.getItem('DTTRACE_SESSIONID')&&localStorage.getItem('DTTRACE_SESSIONID_EXPIRE')>new Date().getTime()) return localStorage.getItem('DTTRACE_SESSIONID');
  const sessionId =uuid();
  createDtSessionId(sessionId);
  return sessionId;
}