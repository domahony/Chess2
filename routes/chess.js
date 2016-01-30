
/*
 * GET users listing.
 */

var util = require('util');
var EventEmitter = require('events');

var fs = require('fs');
var spawn = require('child_process').spawn;

function Game() {

	EventEmitter.call(this);
	
	this.moves = [];

	this.child = spawn(
		'/usr/games/gnuchess', ['--uci'],
		{
			detached: true,
    			stdio: ['pipe', 'pipe', 'pipe'],
		}
	);

	var gameScope = this;
	this.child.stdout.on("data", function(data) {
		//console.log("Data1: " + data);
		var regexp = /bestmove\s(\S+)($|\s)/;
		var match = regexp.exec(data);

		if (match != null) {
			gameScope.emit("bestmove", match[1]);
		}
	});

	this.write = function(cmd) {
		console.log(cmd);
		this.child.stdin.write(cmd, 'utf8');
	}

	this.child.on("disconnect", function(data) {
		console.log("Disconnect: " + data);
	});
	this.child.on("error", function(data) {
		console.log("Error: " + data);
	});
	this.child.on("close", function(code, signal) {
		console.log("Close Code: " + code);
		console.log("Close Signal: " + signal);
	});
}

util.inherits(Game, EventEmitter);

var theGame = new Game();
theGame.write("ucinewgame");
//theGame.write("position startpos moves e2e4");

exports.move = function(req, res){
	
	theGame.moves.push(req.params.cmd);

	var cmd = "position startpos moves"; //+ req.params.cmd + "\n";
	
	var m;
	for (m in theGame.moves) {
		cmd += " " + theGame.moves[m];
	}
	cmd += "\n";
	cmd += "go movetime 2000\n"; 

	var cb = function(data) {
		console.log("Data2: " + data);
		
		theGame.moves.push(data);
	
		res.send({move: data});
		theGame.removeListener("bestmove", cb);
	};

	theGame.on("bestmove", cb); 
	theGame.write(cmd);
};

exports.newgame = function(req, res) {
	theGame.write("ucinewgame");
	theGame.moves = [];
	res.send("Yeah!");
};
