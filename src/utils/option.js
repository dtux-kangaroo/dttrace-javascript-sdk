const DEFALUT_OPTIONS={
  url:'https://recvapi.md.dtstack.com/dta/',
  session_expiration:30*60*1000,
  status:1
}

export default {
  get:(name)=>{
    if(name) return DEFALUT_OPTIONS[name];
    return  DEFALUT_OPTIONS;
  },
  set:(options)=>{
    Object.assign(DEFALUT_OPTIONS,options);
    return DEFALUT_OPTIONS;
  }
}