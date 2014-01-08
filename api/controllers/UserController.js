/**
 * UserController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */


var github  = require('octonode'),
	url 	= require('url'),
	qs  	= require('querystring');
		
var authUrl = null , state = null;

module.exports = {
    
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to UserController)
   */
	_config: {},

	login: function (req, res) {

		
		if(!authUrl){

			var gitmine = sails.config.gitmine;
			authUrl = github.auth.config({
				id 	   : gitmine.clientID,
				secret : gitmine.clientSecret
			}).login(['user', 'repo', 'gist']);

			state = authUrl.match(/&state=([0-9a-z]{32})/i);
		}

		res.writeHead(301, {'Content-Type': 'text/plain', 'Location': authUrl});
	    res.end('Redirecting to ' + authUrl);
	},

	auth : function (req, res){
		
		var uri    = url.parse(req.url),
			values = qs.parse(uri.query);


		if (!state || state[1] != values.state) {
      		res.writeHead(403, {'Content-Type': 'text/plain'});
      		return res.end('');
		}

		github.auth.login(values.code, function (err, token) {

			req.session.token = token;
			return res.redirect('/user/index');	

      	});
	}, 

	index : function(req , res){

		var token = req.session.token;
		if(!token) return res.redirect('/user/login');

		
		var client = github.client(token);

		client.get('/user', {}, function (err, status, body, headers) {

			if(err) return res.redirect('/user/login');
  			
  			res.writeHead(200, {'Content-Type': 'text/plain'});
  			res.send(JSON.stringify(body));
		});

	},

	logout: function( req, res ) {
		req.session.token = null;
    	res.send( "Successfully logged out" );
	}
};
