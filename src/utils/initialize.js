import send from './send';
import ready from './ready';
import options from './options';
// 添加监听事件
const addEventListener = (element, evType, fn, useCapture) => {
  if (element.addEventListener) {
    element.addEventListener(evType, fn, useCapture); //DOM2.0
    return true;
  } else if (element.attachEvent) {
    const r = element.attachEvent('on' + evType, fn);//IE5+
    return r;
  } else {
    element['on' + evType] = fn; //DOM 0
  }
}
export default () => {
  ready(()=>{
    let enterTime=new Date().getTime();
    const element_body = document.getElementsByTagName('body')[0];
    addEventListener(element_body, 'click', function (event) {
      const e = window.event || event;
      if (e.target.className.indexOf('Dta') > -1) {
        const params = {};
        Object.keys(e.target.dataset).filter(key => {
          if (key.indexOf("dta") > -1) {
            params[key.substring(3).toLocaleLowerCase()] = e.target.dataset[key]
          }
        });
        send(params);
      }
    },false);
  })
}