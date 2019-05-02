'use strict';

const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, 'index.html');
var mac;
var comunicacion;
var entrada;
var salida;
var temp;
var hum;
var est_rele;//activado
var status;
var tiempomilliseconds;
var enviado;


const server = express()
  .get('/test', function (req, res){
  status=new Date();//marca de tiempo;
  tiempomilliseconds=Date.now();
  console.log("tiempo_get"+tiempomilliseconds)
  mac=req.param('mac');
  comunicacion=req.param('estado');
  entrada=req.param('entrada');
  salida= req.param('salida');
  temp=req.param('temp');
  hum=req.param('hum');
  console.log('mac: '+mac);
  console.log('comu: '+comunicacion);
  console.log('entrada: '+entrada);
  console.log('salida: '+salida);
  console.log('temp: '+temp);
  console.log('hum: '+hum);
   if(entrada==1){res.send('[id]:['+mac+']::[a]:['+entrada+']')}
   if(est_rele==1 && salida==1 && enviado==1){enviado=0; res.send('[id]:['+mac+']::[r]:[0]')}//DESACTIVACION
   if(est_rele==0 && salida==0 && enviado==1){ enviado=0; res.send('[id]:['+mac+']::[r]:[1]')}//ACTIVACION
      
  })
  .use((req, res) => res.sendFile(INDEX) )
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
});



setInterval(() => io.emit('time', new Date().toTimeString()), 1000);
setInterval(() => io.emit('arduino',mac), 1000);
setInterval(() => io.emit('alarma',entrada), 1000);
setInterval(() => io.emit('rele',salida), 1000);
setInterval(() => io.emit('temp',temp), 1000);
setInterval(() => io.emit('humedad',hum), 1000);
setInterval(() => io.emit('status',tiempomilliseconds), 1000);
io.on('connection', function(socket) {
   socket.on('activar', function(data1) {
      console.log(data1);
      est_rele=data1;
      enviado=1;
    });
   
});
