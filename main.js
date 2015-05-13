var http = require('http');
var Promise = require('promise');
var moment = require('moment');

/*
	How to authorise
	
	go to:
	https://api.moves-app.com/oauth/v1/authorize?response_type=code&client_id=CwgJeoq1e2x0tl0hi4GksX326wDa82d3&scope=location

	auth in app

	page provides code (not final access_token) in redirect
	http://localhost:3000/auth?code=E77I4BvMn6bYG7ycht15k74S576SudlIDh_aZRQk10w73T1Hf93PSuJh9mvRvws9&state=
	
	get access_token
	https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code=E77I4BvMn6bYG7ycht15k74S576SudlIDh_aZRQk10w73T1Hf93PSuJh9mvRvws9&client_id=CwgJeoq1e2x0tl0hi4GksX326wDa82d3&client_secret=8bH5AX7t_Fwk7Crw7alr9cUyNqB1gENpjFSNu6SXs93QL1xA_hc8sUe9WGme2wAm&redirect_uri=http://localhost:3000	

	{"access_token":"f3Hzj2ieGYSYq0tlFSzVyiDQYtW8WKVUEr7n_QW0i3d2m1dPNW647yGqZ_CXotjE","token_type":"bearer","expires_in":15551999,"refresh_token":"WLFiNaydTRcFVn1nID4CsPtlffrPNaRbQTbe6RkR62WwhCRn8qoFjSP8bfGCKz8r","user_id":70419708032359381}	
*/

var Moves = require('moves')
, moves = new Moves({
      client_id: 'CwgJeoq1e2x0tl0hi4GksX326wDa82d3'
    , client_secret: '8bH5AX7t_Fwk7Crw7alr9cUyNqB1gENpjFSNu6SXs93QL1xA_hc8sUe9WGme2wAm'
    , redirect_uri: 'http://localhost:3000'
  });

var access_token = 'gX2e14KF2na6q7n0Z68d815pvo48M85412d989o8036Oxx7o5CYW58g2_s4D4G4o';

function getMovesLocation() {
	return new Promise(function (resolve, reject) {
		var location;

		var today = moment().format('YYYYMMDD');
		console.log(today);

		moves.get('/user/places/daily/'+today, access_token, function(error, response, body) {
			console.log(body);
			var reply = JSON.parse(body);
			console.log(reply);
			console.log(reply[0].segments);
			location = JSON.stringify(reply[0].segments[reply[0].segments.length-1].place.location);
			resolve(location);
		});	
	});
}



function requestHandler(request, response) {
	response.setHeader('Access-Control-Allow-Origin', 'http://transparency.tomchambers.me');
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