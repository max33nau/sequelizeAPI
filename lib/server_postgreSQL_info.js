"use strict";

module.exports = function config() {
  let my = {};
  my.serverHost = "127.0.0.1";
  my.serverPort = '5432';
  my.expressServer = 8484;
  my.dbName = 'players';
  my.username = 'admin';
  my.password = 'abc';
  my.dialect = 'postgres'
  return my;
};
