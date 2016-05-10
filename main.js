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
	
	get access_token POST request
	https://api.moves-app.com/oauth/v1/access_token?grant_type=authorization_code&code=539LemNw3nSZ8NBFM1EKM1pxcb7eBeY851uYuG8WasPh25Jm9MloOkoSAynU5khX&client_id=CwgJeoq1e2x0tl0hi4GksX326wDa82d3&client_secret=8bH5AX7t_Fwk7Crw7alr9cUyNqB1gENpjFSNu6SXs93QL1xA_hc8sUe9WGme2wAm&redirect_uri=http://localhost:3000	

	{
  "access_token": "2L0FkVHK_aGVxqN23qqkDB07u31Xvti2NC7kYQVP01xwgJvV2effML8jutS_6BV3",
  "token_type": "bearer",
  "expires_in": 15551999,
  	"refresh_token": "fnHx355Tih2a868kEfH2MrPgeLv_8QVD2kznlML1S1x56bMVmJeK5n8R5y21GlZv",
  		"user_id": 70419708032359381
	}
*/

var Moves = require('moves')
, moves = new Moves({
      client_id: 'CwgJeoq1e2x0tl0hi4GksX326wDa82d3'
    , client_secret: '8bH5AX7t_Fwk7Crw7alr9cUyNqB1gENpjFSNu6SXs93QL1xA_hc8sUe9WGme2wAm'
    , redirect_uri: 'http://localhost:3000'
  });

var access_token = '2L0FkVHK_aGVxqN23qqkDB07u31Xvti2NC7kYQVP01xwgJvV2effML8jutS_6BV3';

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