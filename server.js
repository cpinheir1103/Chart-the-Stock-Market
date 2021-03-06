var express = require('express');  
var app = express();
var http = require('http').Server(app);
var socketIo = require('socket.io');
var io = socketIo(http);

var stocksArr = [];

var port = process.env.PORT || 3000;
http.listen(port, function () {
  console.log('Server listening at port %d', port);
});

//app.use(express.static(__dirname + '/node_modules')); 
app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

function addStock(symbol) {
  // only add if stock is not already in list.
  if (!stocksArr.includes(symbol))
  { 
    stocksArr.push(symbol);
    io.sockets.emit('newstock', { symbol: symbol });  // let all clients know
  }
}

function delStock(symbol) {
  for(var i = 0; i < stocksArr.length; i++) { 
    if (stocksArr[i] === symbol) {
      stocksArr.splice(i, 1);
      io.sockets.emit('delstock', { symbol: symbol });  // let all clients know
    }
  }
}

io.on('connection', function (socket) {
  //io.sockets.emit('broadcast message', { broadcast: 'msg' });
  
  socket.emit('allstocks', { stocks: stocksArr });
    
  socket.on('newstock', function (data) {
    addStock(data.symbol);
    console.log("stocksArr=" + stocksArr);
  });
  
  socket.on('delstock', function (data) {
    delStock(data.symbol);
    console.log("stocksArr=" + stocksArr);
  });
  
});

// listen for requests :)
//app.listen(8080);
