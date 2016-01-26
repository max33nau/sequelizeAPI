"use strict";
var express = require('express');
var bodyParser = require('body-parser');
var playerHandler = require('./player_handler');

module.exports = function stats() {
  var router = express.Router();
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({extended: false}));
  router.use((error,request,response,next) => {
    if(error) {
      response.status(500);
      response.render('error', {error});
    }
  });
  router.get('/', playerHandler.getAll);
  router.get('/:id', playerHandler.getPlayerById);
  router.post('/', playerHandler.createPlayer);
  router.put('/:id', playerHandler.updateWholeObject);
  router.patch('/:id', playerHandler.updatePlayerInfo);
  router.delete('/:id', playerHandler.removePlayer);
  return router;
};
