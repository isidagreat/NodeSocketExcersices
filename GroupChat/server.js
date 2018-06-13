// load the express module and store it in the variable express
const express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var app = express();
const server = app.listen(1337);
const io = require("socket.io").listen(server);
var history = [];

io.on("connection", function(socket){
	socket.emit("greeting", {msg:"Greetings, from the server Node, Brought to you by sockets! - Server"});
	socket.on("posting_form", function(data){
		console.log(data);
		socket.emit("updated_message", {msg:data, msgs:history});
});
		socket.on("newChat", function(data){
		console.log(data[0]);
		history.push(data[0]);
		socket.emit("updated_chat", {msg:data});
		socket.broadcast.emit("updated_chat", {msg:data});
});
});
app.use(session({
	secret: "magiMouse",
	resave: false,
	saveUninitialized: true,
	cookie:{maxAge: 8*80*6000}
}));
// this line will allow us to use body parser
app.use(bodyParser.urlencoded({extended: true}));
// athis is the line that tells our server to use the "/static" folder for static cont
app.use(express.static(__dirname + "/static"));
// This sets the the view engine so that express knows that we are using ejs
app.set("view engine", "ejs");
console.log("lets find out what app is", app);
// use app's get method and pass it the base route '/' and a callback
app.get('/', function(request, response){
	response.render("index");
});
app.post("/process", function(request, response){
	console.log("POST DATA \n \n", request.body);
	request.session.post = {name: request.body.name,location: request.body.dojo, language: request.body.language, msg: request.body.message};
	response.redirect("/")
});



app.listen(8000,function(){
	console.log("listening on port 8000");
});