import send from './send';
// 添加监听事件
const addEventListener = (element, evType, fn, useCapture) => {
  if (element.addEventListener) {
    element.addEventListener(evType, fn, useCapture); //DOM2.0
    return true;
  } else if (element.attachEvent) {
    var r = element.attachEvent('on' + evType, fn);//IE5+
    return r;
  } else {
    element['on' + evType] = fn; //DOM 0
  }
}
//判断是否是ios
 const isIos=()=>{
  const u = navigator.userAgent;
  return !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
}

export default () => {
  const enterTime=new Date().getTime();
  const element_body = document.getElementsByTagName('body')[0];
  addEventListener(element_body, 'click', function (event) {
    var e = window.event || event;
    if (e.target.className.indexOf('dta') > -1) {
      const params = {};
      Object.keys(e.target.dataset).filter(key => {
        if (key.indexOf("dta") > -1) {
          params[key.substring(3).toLocaleLowerCase()] = e.target.dataset[key]
        }
      });
      send(params);
    }
  },false);

  if(isIos()){
    addEventListener(window,'pagehide',function(){
      const leaveTime = new Date().getTime();
      const params={};
      params.triggerType = 'leave';
      params.stayTime = leaveTime - enterTime;
      send(params);
    });
  }else{
    addEventListener(window,'beforeunload',function(){
      const leaveTime = new Date().getTime();
      const params={};
      params.triggerType = 'leave';
      params.stayTime = leaveTime - enterTime;
      send(params);
    });
  }
}