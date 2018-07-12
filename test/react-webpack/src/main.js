import React from 'react';
import { render } from 'react-dom';
import App from './App.js';
import Dttrace from '../dttrace';
Dttrace.init({
  appKey:'hello123',
  getSessionId:function(){
    return Dttrace.cookie.get('_ga');
  },
  getUserId:function(){
    return 'userId123' 
  }
});


render(
  <App></App>,
  document.getElementById("root")
); 
