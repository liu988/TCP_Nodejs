var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
//------------------------------------------
//TCP服务器端
var net = require('net');
var server = net.createServer();
//聚合所有客户端
var sockets = [];

server.on('connection',function(socket){
    server.maxConnections=2;
    console.log("服务器最大连接数为%s",server.maxConnections);
    server.getConnections(function(err,count){
        console.log("已经有%s个客户端连接",count);
    });

    console.log("%s客户端与服务器建立连接",server.address().address);

    // 我们获得一个连接 - 该连接自动关联一个socket对象
    console.log('CONNECTED: ' + socket.remoteAddress + ':' + socket.remotePort);

    // 为这个socket实例添加一个"data"事件处理函数
    socket.on('data', function(data) {
        console.log('DATA ' + socket.remoteAddress + ': ' + data);
        // 回发该数据，客户端将收到来自服务端的数据
        //socket.write('You said "' + data + '"');
    });

    // 为这个socket实例添加一个"close"事件处理函数
    socket.on('close', function(data) {
        console.log('CLOSED: ' +
            socket.remoteAddress + ' ' + socket.remotePort);
    });

});
server.on('error',function(err){
    throw err;
});
server.on('listening',function(){
    console.log("服务器开始监听%j",server.address())
    console.log("服务器开始监听")
});
server.on('close', function(){
    console.log('Server closed');
});

server.listen(9966,'192.168.0.3');


//------------------------------------------
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
