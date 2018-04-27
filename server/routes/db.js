var mongoose = require( 'mongodb' );
var ObjectId = require('mongodb').ObjectID;
var socketList =  require("../routes/globalVar").globalVars.socketList;
var db;
mongoose.connect('mongodb://localhost:27017/waste', function(err, database){
	if(err){
		console.log(err);
		return;
	}
	console.log("connect");
	db=database;
});
function Database(){}
Database.prototype.validateUser = function(user,cb){
	db.collection("users").findOne(user,function(err,res){
		if(res == null){
			cb({logged:false,error:"Invalid email / password"});
		}
		else{
			cb({logged:true,fullName:res.fullName,email:res.email});
		}
	});
}
Database.prototype.addUser = function(user,cb){
	user.image = "./images/dp/default.png";
	db.collection("users").insert(user,function(err,res){
		if(!err){
			cb({email:user.email,fullName:user.fullName,status:"U"});
			db.collection("friends").insert({email:user.email,friends:[]});
		}
		else{
			cb({status:"failed"});
		}
	});

}
Database.prototype.checkEmail = function(email,cb){
	db.collection("users").findOne(email,function(err,res){
		if(res == null){
			cb({alreadyExist:false});
		}
		else{
			cb({alreadyExist:true});	
		}
	});
}
Database.prototype.checkEmailAndDOB = function(user,cb){
	db.collection("users").findOne(user,function(err,res){
		if(res == null){
			cb({status:"failed"});
		}
		else{
			cb({status:"success"});	
		}
	})
}
Database.prototype.resetPassword = function(user,cb){
	db.collection("users").update({email:user.email},{$set:{password:user.password}},function(err,res){
		if(err == null){
			cb({status:"success"});
		}
		else{
			cb({status:"failed"});
		}
	})
}
Database.prototype.getUserInfo = function(user,cb){
	db.collection("users").findOne({email:user.email},{dob:1,fullName:1,mobile:1,_id:0},function(err,result){
		cb(result);
	})
}
Database.prototype.setUserInfo = function(user,cb){
	db.collection("users").update({email:user.email},{$set:user.user},function(err,res){
		if(err == null){
			cb({status:"updated"});
		}
		else{
			cb({status:"failed"});
		}
	});
}
Database.prototype.changePassword = function(detail,cb){
	db.collection("users").findOne({email:detail.email,password:detail.passwords.oldpassword},function(err,res){
		if(res == null){
			cb({status:"failed"});
			return
		}
		else{
			cb({status:"success"});
			db.collection("users").update({email:detail.email},{$set:{password:detail.passwords.newpassword}});
		}
	})
}
Database.prototype.saveProfileImg = function(user){
	db.collection("users").update({email:user.email},{$set:{image:user.image}},function(err,res){
	});
}
Database.prototype.getUsers = function(user,cb){
	db.collection("users").find({},{"fullName":1,"email":1,"image":1,"_id":0}).toArray(function(err,result){
		//cb(result);
		var allUsers = result;
		db.collection("friends").findOne({email:user.email},function(err,res){
		
			/*var resuser = allUsers.find(function(user1){
					console.log(user,user1);
					return user.email == user1.email;
				});
				allUsers.splice(allUsers.indexOf(resuser),1);*/

			var friends = res == null ? [] : res.friends;
			
			for(var i=0;i<friends.length;i++){
				var friend = friends[i];
				var resuser = allUsers.find(function(user1){
					return user1.email == friend.email;
				});
				friend.image = resuser.image;
				friend.fullName = resuser.fullName;
				var socket = socketList[friend.email];
				if(socket){
					friend.online=true;
				}
				else{
					friend.online=false;	
				}
				allUsers.splice(allUsers.indexOf(resuser),1);
			}
			for(var i=0;i<allUsers.length;i++){
				var socket = socketList[allUsers[i].email];
				var online = false;
				if(socket){
					online=true;
				}
				friends.push({fullName:allUsers[i].fullName,email:allUsers[i].email,status:"U",image:allUsers[i].image,online:online});
			}
			cb(friends);
		});
	})
}
Database.prototype.getFriends = function(user,cb){
	db.collection("friends").findOne({email:user.email},function(err,result){
		if(result == null){
			cb([]);
		}
		else{
			cb(result.friends);
		}
	})
}
Database.prototype.loadMsg = function(users,cb){
	db.collection("msgs").find({$or:[{$and : [{from:users.user1},{to:users.user2}]},{$and :[{to:users.user1},{from:users.user2}]}]}).toArray(function(err,result){
		cb(result);
	})
	/*db.collection("friends").findOneAndUpdate({"email":users.user1,"friends.email":users.user2},
			{$set:{"friends.$.unread":0}},function(err,result){
				var res = getFriendRecord(users.user2,result.value.friends);
				res.unread = 0;
				var user = socketList[users.user1];
				if(user){
					user.emit("updateFriendList",res);
				}
			});*/
			setUnread(users);
}
Database.prototype.saveMsg = function(msgDetail){
	msgDetail.time = new Date();
	msgDetail.status = 0;
	db.collection("msgs").insert(msgDetail);
	db.collection("friends").findOneAndUpdate({"email":msgDetail.from,"friends.email":msgDetail.to},
			{$set:{"friends.$.lastActivity":msgDetail.time}},function(err,result){
				var res = getFriendRecord(msgDetail.to,result.value.friends);
				res.lastActivity = msgDetail.time;
				var user = socketList[msgDetail.from];
				if(user){
					user.emit("updateFriendList",res);
				}
			});
	db.collection("friends").findOneAndUpdate({"email":msgDetail.to,"friends.email":msgDetail.from},
			{$set:{"friends.$.lastActivity":msgDetail.time},$inc:{"friends.$.unread":1}},
			function(err,result){
				var res = getFriendRecord(msgDetail.from,result.value.friends);
				res.lastActivity = msgDetail.time;
				res.unread +=1;
				var friend = socketList[msgDetail.to];
				if(friend){
					friend.emit("updateFriendList",res);
				}
			});
}
var getFriendRecord = function(email,friends){
	for(var i=0; i<friends.length;i++){
		if(email == friends[i].email){
			return friends[i];
		}
	}
	return null;
}
Database.prototype.addFriend = function(req,cb){
	var currentUser = req.currentUser;
	var friend = req.friend;
	var time = new Date();
	db.collection("friends").findOne({email:currentUser.email,"friends.email":friend.email},function(err,result){
		if(result == null){
			db.collection("friends").update({email:currentUser.email},{$push:{friends:{
				email:friend.email,
				status:"S",
				lastActivity:time,
				unread:0
			}}});
			db.collection("friends").update({email:friend.email},{$push:{friends:{
				email:currentUser.email,
				status:"N",
				lastActivity:time,
				unread:0
			}}});
		}
		else{
			db.collection("friends").update({"email":currentUser.email,"friends.email":friend.email},
			{$set:{"friends.$.status":"S","friends.$.lastActivity":time}});
			db.collection("friends").update({"email":friend.email,"friends.email":currentUser.email},
			{$set:{"friends.$.status":"N","friends.$.lastActivity":time}});
		}
	})
	var result = {}
	result.toUser = {
		email:friend.email,
		fullName:friend.fullName,
		status:"S"
	}
	result.toFriend = {
		email:currentUser.email,
		fullName:currentUser.fullName,
		status:"N"	
	}
	cb(result);
}
Database.prototype.respondRequest = function(reqInfo,cb){
	var currentUser = reqInfo.currentUser;
	var type = reqInfo.type;
	var friend = reqInfo.friend;
	var lastActivity = new Date();
	var result = {};
	result.toUser = {
		email:friend.email,
		fullName:friend.fullName,
	}
	result.toFriend = {
		email:currentUser.email,
		fullName:currentUser.fullName,
	}
	if(type == "accept"){
		db.collection("friends").update({"email":currentUser.email,"friends.email":friend.email},
			{$set:{"friends.$.status":"F","friends.$.lastActivity":lastActivity}});
		db.collection("friends").update({"email":friend.email,"friends.email":currentUser.email},
			{$set:{"friends.$.status":"F","friends.$.lastActivity":lastActivity,"friends.$.unread":1}});
		result.toUser.status = "F";
		result.toUser.lastActivity = lastActivity;
		result.toFriend.status="F";
		result.toFriend.lastActivity = lastActivity;
		result.toFriend.unread = 1;

	}
	else if(type == "reject"){
		db.collection("friends").update({"email":currentUser.email,"friends.email":friend.email},
			{$set:{"friends.$.status":"U","friends.$.lastActivity":lastActivity}});
		db.collection("friends").update({"email":friend.email,"friends.email":currentUser.email},
			{$set:{"friends.$.status":"R","friends.$.lastActivity":lastActivity,"friends.$.unread":1}});
		result.toUser.status = "U";
		result.toUser.lastActivity = lastActivity;
		result.toFriend.status="R";
		result.toFriend.lastActivity = lastActivity;
		result.toFriend.unread = 1;
	}
	cb(result);
}
Database.prototype.setUnread = function(users){
	setUnread(users);
}
var setUnread = function(users){
	db.collection("friends").findOneAndUpdate({"email":users.user1,"friends.email":users.user2},
	{$set:{"friends.$.unread":0}},function(err,result){
		var res = getFriendRecord(users.user2,result.value.friends);
		res.unread = 0;
		var user = socketList[users.user1];
		if(user){
			user.emit("updateFriendList",res);
		}
	});	
}
module.exports = Database;
/*> db.friends.update( {email:"imthihas94@gmail.com","friends.email":"lovelyfires90@gmail.com"}, {$set:{"friends.$.unread":4}})*/
/*
U - unknown
F - friend
S - Request Sent
N - new request
R - Reject
*/