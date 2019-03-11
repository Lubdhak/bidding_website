/**
 * Module dependencies.
 */
var bodyParser = require('body-parser');
var express = require('express');
var config = require('config');
var dbConfig = config.get("db");
var MongoClient = require('mongodb').MongoClient;
var myserver = express();

var host = dbConfig.mongoDB.host

var db;
console.log("connecting to .. ==>",host);
myserver.use(function(req, res, next){
	if (db){
		req['db'] = db;
		return next();
	}
	MongoClient.connect(host,{ useNewUrlParser: true }, function(err, connection) {
		if (err) next(err);
		dbnaam = "hodlers";
		console.log("Connecting to ==>",dbnaam);
		db = connection.db(dbnaam);
		req['db'] = db;
		next();
	});
});
	






//// ▶▶ enable cors ◀◀ ////
myserver.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token");
	next();
});


// parse application/x-www-form-urlencoded
myserver.use(bodyParser.urlencoded({ extended: false }));
myserver.use(bodyParser.json());
var serverConfig = config.get('serverConfig');

require('./src/apis')(myserver);

myserver.listen(serverConfig.port, function() {
   console.log("Server started on port: " + serverConfig.port);
});


	

