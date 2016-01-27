"use strict";

const express = require('express');
const info = require('./server_postgreSQL_info');
const database = require('./database');
const stats = require('./stats');

module.exports = function start(callback) {
  var dbData = database();
  var Player = dbData.definePlayer();
  var my = info();
  var app = express();
  app.use('/player', stats() );
  var server = app.listen(process.env.PORT || my.expressServer, function() {
    console.log('server is connected');
    Player.sync({force: true}).then(function(){
      console.log('Player Table Created');
      callback();
    });

  });

  return {
    close: function close(callback) {
      server.close(callback);
    }
  };
};
