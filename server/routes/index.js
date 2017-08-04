var express = require('express');
var database = require('./db');
var router = express.Router();
var io = require("../routes/globalVar").globalVars.io;
var db = new database();
var socketList = [];
io.on('connection',function(sock){
	console.log("connected user :",sock.handshake.query.email);
	socketList[sock.handshake.query.email] = sock;
	sock.on("sentMessage",function(msgDetail){
		var to = msgDetail.to;
		var socket = socketList[to];
		db.saveMsg(msgDetail);
		if(socket){
			socket.emit("recMessage",msgDetail);
		}
	})
});
router.post("/validate",function(req,res){
	db.validateUser(req.body,function(result){
		res.json(result);
	});
});
router.post("/newUser",function(req,res){
	db.addUser(req.body,function(result){
		res.json(result);
	});
})
router.post("/checkEmail",function(req,res){
	db.checkEmail(req.body,function(result){
		res.json(result);
	})
})
router.post("/getUsers",function(req,res){
	db.getUsers(req.body,function(result){
		res.json(result);
	})
})
router.post("/getMessages",function(req,res){
	db.loadMsg(req.body,function(result){
		res.json(result);
	});
})
router.post("/addFriend",function(req,res){
	db.addFriend(req.body,function(result){
		res.json(result);
	})
	res.end();
})
module.exports = router;