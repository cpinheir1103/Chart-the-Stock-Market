var express = require('express');  
var app = express();
var http = require('http').Server(app);
var socketIo = require('socket.io');
var io = socketIo(http);

var port = process.env.PORT || 3000;

http.listen(port, function () {
  console.log('Server listening at port %d', port);
});


//app.use(express.static(__dirname + '/node_modules')); 
app.use(express.static('public'));

/*
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(express.static('public'));
*/

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', function (socket) {
  io.sockets.emit('broadcast message', { broadcast: 'msg' });
  
  socket.emit('news', { hello: 'world' });
  
  socket.on('my other event', function (data) {
    console.log(data);
  });
});

// listen for requests :)
//app.listen(8080);
