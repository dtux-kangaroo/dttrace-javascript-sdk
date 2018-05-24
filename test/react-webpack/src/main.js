import React from 'react';
import { render } from 'react-dom';
import App from './App.js';
import Dta from '../../common-html/dta-dev';
Dta.options.setDefaultOptions({
  url:'http://recv.log.dtstack.com/dtas',
  params:{
    "global":"全局变量"
  }
});
render(
  <App></App>,
  document.getElementById("root")
); 