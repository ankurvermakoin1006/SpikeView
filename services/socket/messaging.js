module.exports = function (server) {
	var io = require('socket.io').listen(server);
	var redis = require('socket.io-redis');
	io.adapter(redis({
		host: 'localhost',
		port: 6379
	}));

	// users which are currently connected to the socket
	const users = {};
	SocketUser.getList({},function(res){				
		if(res.result.length > 0){
		 let socketUser= res.result[0];						 
		 socketUser['userRecord']={};		 
		 SocketUser.update(socketUser);	
		}
	})

	var userlist=[];
	var connectionList = [];
	io.sockets.on('connection', function (socket) {
		//logger.info('connection established');
		// when the client emits 'sendchat', this listens and executes
	
		 socket.on('sendchat', function (data) {
		
			//logger.info('semdachate',data);
			// we tell the client to execute 'updatechat' with 2 parameters			
			let coupleListIndex = connectionList.findIndex(todo => (todo.userId == data.receiver) && (todo.partnerId == data.sender) && todo.status == 1);

			if (coupleListIndex !== -1) {
				data.status = 1;
			} else {
				data.status = 0;
			}		
			data.text= data.text.trim();			
			//	io.sockets.emit('updatechat', socket.user, data); 						
			Message.saveChatHistory(data, function (res) {
				logger.info('connection created : ', res.status);
			});
           //for message broadcast
			// Message.saveBroadCasetChatHistory(data, function (res) {
			// 	logger.info('connection created : ', res.status);
			// });
			//logger.info(data);
		  
        
		//   userlist.forEach(function(item){
		//	if(item.userId == data.receiver)   
				socket.broadcast.to(data.receiver).emit( 'updatechat', data );
		//	if(item.userId == data.sender) 
				socket.broadcast.to(data.sender).emit( 'updatechat', data );
		//   })

			
		//	io.to(parseInt(data.receiver)).emit('updatechat', data);
		//	io.to(parseInt(data.sender)).emit('updatechat', data);
		//	io.sockets.emit('updatechat', data);
		});


		socket.on('setConnectionList', function (data) {
			// we tell the client to execute 'setConnectionList' with 2 parameters
			let coupleListIndex = connectionList.findIndex(todo => todo.userId == data.userId);
			if (data.screenId == 1) {
				if (coupleListIndex !== -1) {
					if (connectionList[coupleListIndex].partnerId !== data.partnerId) {
						connectionList.splice(coupleListIndex, 1);
						connectionList.push({
							userId: data.userId,
							partnerId: data.partnerId,
							status: 1
						});
					}
				} else {
					connectionList.push({
						userId: data.userId,
						partnerId: data.partnerId,
						status: 1
					});
				}
			} else if (data.screenId == 0) {
				if (coupleListIndex !== -1) {
					connectionList.splice(coupleListIndex, 1);
				}
			}			
			//logger.info(connectionList);
		});

		// when the client login and emits 'adduser', this listens and executes
		socket.on('adduser', function (userData) {	
		
			let user = {userId: userData.userId , deviceId: userData.deviceId};
			socket.user =  user;
			let userId = user.userId;

		    SocketUser.getList({},function(res){				
               if(res.result.length > 0){
				let socketUser= res.result[0];	
		    
				socketUser['userRecord'][userId]= userId;
				SocketUser.update(socketUser);
				let index= userlist.findIndex(todo => todo.userId == user.userId && todo.deviceId == user.deviceId);
				if(index === -1){
					userlist.push(user);
				}	

				io.sockets.emit('updateusers', socketUser['userRecord']);	
				
			   }else{
				console.log('else');
				let socketUser= {};
				users[userId] = userId;
				socketUser['userRecord']= users;  				
				SocketUser.create(socketUser);
				io.sockets.emit('updateusers', users);	
				let index= userlist.findIndex(todo => todo.userId == user.userId && todo.deviceId == user.deviceId);
				if(index === -1){
					userlist.push(user);
				}
				
			   }
			})					
			socket.join(user.userId);			
		});

			// send the added user in socket
			socket.on('getUsers', function () {		
				// we store the userId in the socket session for this client		
				SocketUser.getList({},function(res){				
					if(res.result.length > 0){
					 let socketUser= res.result[0];							 
					 io.sockets.emit('updateusers', socketUser['userRecord']);						 
					}
				 })				
			});

		// when the user disconnects.. perform this
		socket.on('disconnect1', function (data) {		
		//	let coupleListIndex = connectionList.findIndex(todo => todo.userId == socket.user);
	//		if (coupleListIndex !== -1) {
		//		connectionList.splice(coupleListIndex, 1);
		//	}		

		
		//	userlist.splice();
			// remove the username from global usernames list
           
			let index= userlist.findIndex(todo => todo.userId == data.userId && todo.deviceId == data.deviceId);
			if(index !== -1){
				userlist.splice(index,1);
			}
			
			

			let indexFound = userlist.findIndex(todo => todo.userId == data.userId);
			if(indexFound == -1){				
			
				delete users[data.userId];
			   SocketUser.getList({},function(res){				
				if(res.result.length > 0){
				 let socketUser= res.result[0];	
				 			
				 delete socketUser['userRecord'][data.userId];
				 
				 SocketUser.update(socketUser);		
 
				 io.sockets.emit('updateusers', socketUser['userRecord']);	
				 
				}
			 })
			  // io.sockets.emit('updateusers', users);
			}
			// update list of users in chat, client-side
		
			
		});
	});
}
var Message = require('../messaging/message');
var SocketUser = require('../socketUser/socketUser');
var logger = require('../../logger.js');