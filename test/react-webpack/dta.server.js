const path=require('path');
const webpack=require('webpack');
const webpackDevServer=require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackCofig={
  entry:path.resolve(__dirname,'src/main.js'),
  output:{
    path:path.resolve(__dirname,'dist'),
    filename:'app.bundle.js'
  },
  devtool: 'cheap-module-eval-source-map',
  resolve:{
    extensions:['.js']
  },
  module:{
    rules:[
      {
        test: /\.js$/,
        use: ['babel-loader'],
        exclude: /node_modules/
      }
    ]
  },
  plugins:[
    new HtmlWebpackPlugin(
      {
        filename: 'index.html',
        template: path.resolve(__dirname,'index.html'),
        inject: true
      }
    ),
    new webpack.HotModuleReplacementPlugin()
  ]
}
const compiler=webpack(webpackCofig);
const server=new webpackDevServer(compiler,{
  clientLogLevel: 'warning',
  disableHostCheck:true,
  contentBase:path.resolve(__dirname,'dist'),
  hot: true,
  compress: true,
  open:true
});
server.listen(8000);