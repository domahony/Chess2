
/*
 * GET users listing.
 */

var fs = require('fs');
var spawn = require('child_process').spawn;

var child = spawn(

	'/usr/games/gnuchess',
	['--uci'],
	{
    		stdio: ['pipe', 'pipe', 'pipe'],
	}
);



child.stderr.on('data', function (data) {
	console.log('Err: ' + data);
});

exports.move = function(req, res){

	var cmd = "position moves " + req.params.cmd + "\n";
	cmd += "go movetime 2000\n"; 

	child.stdin.write(cmd, 'utf8', function() {

		var buf = '';
		child.stdout.on('data', function (data) {
			buf += data;	
			if (buf.indexOf("bestmove") != -1) {
				res.send(buf);
			}
		});

	});
};
