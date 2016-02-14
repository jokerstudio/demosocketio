var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
var countdown = 10;
var maxUser = 2;
var currentUser = 0;

io.on('connection', function(socket){
  socket.on('disconnect', function(){
      currentUser--;
      socket.leave(socket.room);
      console.log('disconnect'+currentUser);
  });

  socket.on('loginRoom', function(){
    if (currentUser < maxUser) {
      socket.room = 'room1';
      socket.join('room1');
      currentUser++;
      console.log('login room');
    }
  });
});

//Countdown timer
setInterval(function(){
  if (currentUser == maxUser) {
    console.log(countdown+' '+currentUser);
    io.sockets.in('room1').emit('chat message', countdown);
    if(countdown == 0)io.sockets.in('room1').emit('gameresult', 'Gamend');
    countdown--;
    countdown = countdown < 0 ? 10 : countdown;
  }else {
    countdown = 10;
  }
}, 1000);

http.listen(3000, function(){
  console.log('listening on *:3000');
});
