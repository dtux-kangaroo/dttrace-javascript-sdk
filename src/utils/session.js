import Option from  './option';
import cookie from './cookie';
import uuid from './uuid';

const {localStorage}=window;

export const createDtSessionId = ()=>{
  const {session_expiration} = Option.get();
  if(document.referrer===''||document.referrer.indexOf(location.host)<0){
    const sessionId =uuid();
    cookie.set('DTTRACE_SESSIONID',sessionId,session_expiration);
    localStorage.setItem('DTTRACE_SESSIONID',sessionId);
  }
}

export const getDtSessionId=()=>{
  if(cookie.get('DTTRACE_SESSIONID')) return cookie.get('DTTRACE_SESSIONID');
  if(localStorage.getItem('DTTRACE_SESSIONID')) return localStorage.getItem('DTTRACE_SESSIONID');
}