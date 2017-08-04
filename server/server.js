var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var app = express();
var http    = require('http').Server(app);
var io      = require('socket.io')(http);
var globalVar = require("./routes/globalVar").globalVars;
globalVar.io = io;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '../client')));
var router = require("./routes/index");
app.use(router);
// app.set('port', process.env.PORT || 9090);
// var server = app.listen(app.get('port'), function() {
//     console.log('Express server listening on port ' + server.address().port);
// });
http.listen(9090);
module.exports = app;