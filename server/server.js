const path=require('path');
const http=require('http');
const express=require('express');
const socketIO=require('socket.io');
const {generateMessage,generateLocationMessage}=require('./ulits/message.js');
const publicPath=path.join(__dirname, '../public');
const port=process.env.PORT || 3000;
var app=express();
var server=http.createServer(app);
var io=socketIO(server);

io.on('connection',(socket)=>{
  console.log('New user connected');

  socket.emit('newMessage',generateMessage('Admin',"Welcome to Vidya's chat app"));

  socket.broadcast.emit('newMessage',generateMessage('Admin',"New User joined"));


socket.on('createMessage',(message,callback)=>{
  console.log('createMessage',message);
  io.emit('newMessage',generateMessage(message.from,message.text));
callback();

});

socket.on('createLocationMessage',(coords)=>{
  io.emit('newLocationMessage',generateLocationMessage('Admin: ',coords.latitude,coords.longitude));
});

  socket.on('disconnect',()=>{
    console.log('User was disconnected');
  });

});
app.use(express.static(publicPath));

server.listen(port,()=>{
  console.log('Server is up on '+port);
});
