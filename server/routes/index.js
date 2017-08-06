var express = require('express');
var database = require('./db');
var router = express.Router();
var io = require("../routes/globalVar").globalVars.io;
var db = new database();
var socketList =  require("../routes/globalVar").globalVars.socketList;
io.on('connection',function(sock){
	console.log("connected user :",sock.handshake.query.email);
	socketList[sock.handshake.query.email] = sock;
	sock.on("sentMessage",function(msgDetail,fn){
		var to = msgDetail.to;
		var socket = socketList[to];
		db.saveMsg(msgDetail);
		fn(msgDetail)
		if(socket){
			socket.emit("recMessage",msgDetail);
		}
	})
	sock.on("disconnect",function(){
		console.log("user disconnected");
		var user = sock.handshake.query.email;
		socketList.splice(socketList.indexOf(sock),1);
		io.emit("userOnline",{email:user,online:false});	
	});
	io.emit("userOnline",{email:sock.handshake.query.email,online:true});
});
router.post("/validate",function(req,res){
	db.validateUser(req.body,function(result){
		res.json(result);
	});
});
router.post("/newUser",function(req,res){
	db.addUser(req.body,function(result){
		res.json(result);
		io.emit("updateUserList",result);
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
		res.json(result.toUser);
		var email = req.body.friend.email;
		var socket = socketList[email];
		if(socket){
			socket.emit("updateUserList",result.toFriend);
			socket.emit("updateFriendList",result.toFriend);
		}
	})
	res.end();
})
router.post("/respondRequest",function(req,res){
	db.respondRequest(req.body,function(result){
		res.json(result.toUser);
		var email = req.body.friend.email;
		var socket = socketList[email];
		if(socket){
			socket.emit("updateUserList",result.toFriend);
			socket.emit("updateFriendList",result.toFriend);
		}
	});
})
router.post("/getFriends",function(req,res){
	db.getFriends(req.body,function(result){
		res.json(result);
	})
})
router.post("/setunread",function(req,res){
	db.setUnread(req.body);
	res.end();
})
module.exports = router;