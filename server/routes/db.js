var mongoose = require( 'mongodb' );
var ObjectId = require('mongodb').ObjectID;
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
	db.collection("users").insert(user,function(err,res){
		if(!err){
			cb({status:"success"});
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
Database.prototype.getUsers = function(user,cb){
	db.collection("users").find({},{"fullName":1,"email":1,"_id":0}).toArray(function(err,result){
		//cb(result);
		console.log(user);
		var allUsers = result;
		db.collection("friends").findOne({email:user.email},function(err,res){
			console.log(user);
			/*var resuser = allUsers.find(function(user1){
					console.log(user,user1);
					return user.email == user1.email;
				});
				allUsers.splice(allUsers.indexOf(resuser),1);*/

			var friends = res == null ? [] : res.friends;
			console.log("friends")
			console.log(friends);
			for(var i=0;i<friends.length;i++){
				var friend = friends[i];
				var resuser = allUsers.find(function(user1){
					return user1.email == friend.email;
				});
				console.log(resuser)
				friend.fullName = resuser.fullName;
				allUsers.splice(allUsers.indexOf(resuser),1);
			}
			for(var i=0;i<allUsers.length;i++){
				friends.push({fullName:allUsers[i].fullName,email:allUsers[i].email,status:"N"});
			}
			cb(friends);
		});
	})
}
Database.prototype.loadMsg = function(users,cb){
	db.collection("msgs").find({$or:[{$and : [{from:users.user1},{to:users.user2}]},{$and :[{to:users.user1},{from:users.user2}]}]}).toArray(function(err,result){
		cb(result);
	})
}
Database.prototype.saveMsg = function(msgDetail){
	db.collection("msgs").insert(msgDetail);
}
Database.prototype.addFriend = function(req,cb){
	var currentUser = req.currentUser;
	var friend = req.friend;
	friend.status="R";
	db.collection("friends").update({email:currentUser.email},{$push:{friends:friend}},function(err,res){
		console.log(res);
	})
}
module.exports = Database;