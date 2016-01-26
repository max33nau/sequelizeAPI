"use strict";

const express = require('express');
const info = require('./server_postgreSQL_info');
const database = require('./database');
const dbData = database();
const my = info();
const app = express();
const stats = require('./stats');

app.use('/player', stats() );
let server = app.listen(process.env.PORT || my.expressServer, function() {
  console.log('server is connected');
});
