const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const mongoose = require('mongoose');

server.listen(3000);

mongoose.connect('mongodb://carloslahrssen:root@ds111478.mlab.com:11478/swamphacks');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {

});

var Schema = mongoose.Schema;

// create a schema
const userSchema = new Schema({
	userName: String,
	payment: Number, 
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res)=> {
  res.sendFile(__dirname + '/test.html');
});

let userAmount = 0;

io.on('connection', (socket) => {
	console.log('A user connected');
	socket.on('add user', (user)=>{
		User.find({userName:user}, (err,data)=>{
			data.forEach((name)=>{
				if(name.userName != user.toString()){	
					socket.emit('enterRoom');
					console.log("Made it here");
				}
				else{
					socket.emit('userExists');
					console.log('User exists');
				}
			});
		});

	});
	socket.on('payment', (data)=>{
		socket.broadcast.emit('payment', {
			username: socket.userName,
			message:data,
		});
	});

});