"use strict";

const Sequelize = require('sequelize');
const info = require('./server_postgreSQL_info');
const my = info();

module.exports = function database() {
  var Player;
  var sequelize = new Sequelize(my.dbName, my.username, my.password,{
    host: my.serverHost,
    port: my.serverPort,
    dialect: my.dialect
  });
  var dbData = {
    definePlayer: function definePlayer() {
       Player = sequelize.define('player', {
         name: {type: Sequelize.STRING, unique: true, allowNull: false, set: function(value) {
           this.setDataValue('name',value.toUpperCase());
         }  },
         team: {type: Sequelize.STRING, allowNull: false, set: function(value) {
           this.setDataValue('team',value.toUpperCase());
         }  },
         age: {type: Sequelize.INTEGER, allowNull: false, validate: { isInt: true } },
         height: {
           type: Sequelize.ARRAY(Sequelize.INTEGER)
         },
         position: {type: Sequelize.STRING, allowNull: false, set: function(value) {
           this.setDataValue('position',value.toUpperCase());
         }  },
         rookie: Sequelize.BOOLEAN,
         numberOfGamesPlayed: {type: Sequelize.INTEGER,  validate: { isInt: true } },
         totals: {
           type: Sequelize.ARRAY(Sequelize.INTEGER)
         },
         average: {
           type: Sequelize.ARRAY(Sequelize.FLOAT)
         }
       }
       );

       return Player;
     },
    sequelize: sequelize
 }
  return dbData;
};
