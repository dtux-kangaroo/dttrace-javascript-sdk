const rm = require('rimraf');
const ora = require('ora');
const path=require('path');
const chalk=require('chalk');
const rollup = require('rollup');

let builds = require('./config').getAllBuilds();
builds=builds.filter((b)=>{
  return b.output.file.indexOf('dev') === -1;
});
const spinner = ora('building...\n');
spinner.start();
rm(path.resolve(__dirname,'../lib'),(err)=>{
  if(err) throw err;
  let build=0;
  const total =builds.length;
  const next =()=>{
    buildEntry(builds[build]).then(()=>{
      build++;
      if(build<total){
        next();
      }else{
        spinner.stop();
        console.log(chalk.cyan('  Build complete.\n'));        
       }
    });
  }
  next();
});

function buildEntry(config){
  const output=config.output;
  return rollup.rollup(config).then(bundle=>bundle.write(output));
}