import React from 'react';
import { render } from 'react-dom';
import App from './App.js';
import Dttrace from '../dttrace';
Dttrace.init({
  appKey:'hello123',
  appSecret:'md5加密过来',
  appType:'类型',
  token:'hello token'
});
render(
  <App></App>,
  document.getElementById("root")
); 