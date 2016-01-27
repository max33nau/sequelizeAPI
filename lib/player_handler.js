"use strict";

var database = require('./database');
var player_handler = {};
var dbData = database();
var Player = dbData.definePlayer();

player_handler.getAll = function(request, response) {
  Player.findAll({order: 'name ASC'})
  .then(function (players) {
    response.send(players);
  })
  .catch(function (error) {
    response.status(500).send(error);
  });
};

player_handler.getPlayerById = function(request, response) {
  Player.findById(request.params.id)
  .then(function (player) {
    response.send(player);
  })
  .catch( function (error) {
    response.status(500).send(error);
  });
};

player_handler.createPlayer = function(request, response) {
  var newPlayer = {
    name : request.body.name,
    team : request.body.team,
    age : Number(request.body.age),
    height : [ Number(request.body.feet), Number(request.body.inches) ],
    position : request.body.position,
    rookie : request.body.rookie,
    numberOfGamesPlayed : Number(request.body.numberOfGamesPlayed),
    totals : [ Number(request.body.totalPoints),  Number(request.body.totalRebounds),
       Number(request.body.totalAssists), Number(request.body.totalSteals), Number(request.body.totalBlocks)
    ]
  };
  newPlayer.average = [ Number((newPlayer.totals[0]/newPlayer.numberOfGamesPlayed).toFixed(1)), //average points
       Number((newPlayer.totals[1]/newPlayer.numberOfGamesPlayed).toFixed(1)), // average rebounds
       Number((newPlayer.totals[2]/newPlayer.numberOfGamesPlayed).toFixed(1)),// average assists
       Number((newPlayer.totals[3]/newPlayer.numberOfGamesPlayed).toFixed(1)),// average steals
       Number((newPlayer.totals[4]/newPlayer.numberOfGamesPlayed).toFixed(1))// average blocks
    ];
  Player.create(newPlayer)
    .then(function(player) {
      response.send(player.name + ' was added to the database with a id of ' + player.id);
    })
    .catch(function(error) {
      response.status(500).send(error);
    });

};

player_handler.updateWholeObject = function(request, response) {
  Player.findById(request.params.id)
  .then(function (player) {
    var playerkeys = ['name', 'team', 'age', 'position', 'rookie', 'numberOfGamesPlayed', 'totals', 'average', 'height'];
    for (var ii in playerkeys) {
      if (request.body[playerkeys[ii]]) {
          player[playerkeys[ii]] = request.body[playerkeys[ii]];
      } else {
        player[playerkeys[ii]] = null;
      }
    }
    return player;
  })
  .then(function (player) {
     return player.save()
      .then(function() {
        console.log('player was saved');
        response.send(player);
      });
  })
  .catch(function (error) {
    response.status(500).send(error);
  });
};

player_handler.updatePlayerInfo= function(request, response) {
  Player.findById(request.params.id)
  .then(function (player) {
    return player.updateAttributes(request.body)
      .then(function(){
        response.send(player);
      });
  })
  .catch(function(error){
    response.status(500).send(error);
  });
};

player_handler.removePlayer = function(request, response) {
  Player.findById(request.params.id)
  .then(function (player) {
    return player.destroy()
      .then(function(){
        response.send(request.params.id + ' was removed');
      });
  })
  .catch(function(error){
    response.status(500).send(error);
  });
};


module.exports = player_handler;
