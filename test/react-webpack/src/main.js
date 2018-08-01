import React from 'react';
import { render } from 'react-dom';
import App from './App.js';
import Dttrace from '../dttrace';
Dttrace.init({
  appKey:'71704164',
  getSessionId:function(){
    return Dttrace.cookie.get('_ga');
  },
  getUserId:function(){
    return 'userId123' 
  },
  debug:true
});


render(
  <App></App>,
  document.getElementById("root")
); 
