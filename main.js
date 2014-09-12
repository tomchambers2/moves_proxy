var http = require('http');
var Promise = require('promise')

var Moves = require('moves')
, moves = new Moves({
      client_id: 'CwgJeoq1e2x0tl0hi4GksX326wDa82d3'
    , client_secret: '8bH5AX7t_Fwk7Crw7alr9cUyNqB1gENpjFSNu6SXs93QL1xA_hc8sUe9WGme2wAm'
    , redirect_uri: 'http://localhost:3000'
  });

var access_token = 'F5iiORrZjmp224C1DLNT65ZovDUwuH_0m4yDb5mKlBMaj0xjo9nUU4QDzD7UziNN';

function getMovesLocation() {
	return new Promise(function (resolve, reject) {
		var location;
		moves.get('/user/places/daily/20140912', access_token, function(error, response, body) {
			var reply = JSON.parse(body);
			console.log(reply[0].segments);
			location = JSON.stringify(reply[0].segments[0].place.location);
			resolve(location);
		});	
	});
}



function requestHandler(request, response) {
	response.setHeader('Access-Control-Allow-Origin', 'http://tomchambers2.github.io');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	response.writeHead(200);
	getMovesLocation().done(function(data) {
		response.write(data);
		response.end();
	});
};

var server = http.createServer(requestHandler);
server.listen(process.env.PORT || 8080);