const {location}=window;
const DEFALUT_OPTIONS={
  server_url:location.protocol+'//recvapi.md.dtstack.com/dta/',
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