/**
 * RepoController
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

var github  = require('octonode');

module.exports = {
    
  list: function (req, res) {
    
    var token = req.session.token;
    if(!token) return res.redirect('/user/login');
    
    var client = github.client(token);

    client.get('/user/repos', {}, function (err, status, body, headers) {
      err ? res.json({error : err}) :  res.json(body);  
    });
  },

  listByUser : function (req, res) {

    var user  = req.param('user');
    var token = req.session.token;

    var client = token ? github.client(token) : github.client();

    client.get('/users/'+user +'/repos', {}, function (err, status, body, headers) {
      err ? res.json({error : err}) : res.json(body);
    });
  },

  listByOrg : function (req, res) {

    var org   = req.param('org');
    var token = req.session.token;

    var client = token ? github.client(token) : github.client();

    client.get('/users/'+org +'/repos', {}, function (err, status, body, headers) {
      err ? res.json({error : err}) : res.json(body);
    });
  },
  public : function(req, res){
    
    var token  = req.session.token;
    var client = token ? github.client(token) : github.client();

    client.get('/repositories', {}, function (err, status, body, headers) {
      err ? res.json({error : err}) : res.json(body);
    });
  },

  get : function(req, res){

    var token  = req.session.token;
    var client = token ? github.client(token) : github.client();

    var owner = req.param('owner') , repo = req.param('repo')

    client.get('/repos/'+owner+'/'+ repo, {}, function (err, status, body, headers) {
      err ? res.json({error : err}) : res.json(body);
    });

  },
  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to RepoController)
   */
  _config: {}
};


//    List your repositories
//    List user repositories
//    List organization repositories
//    List all public repositories
// Create
//    Get
// Edit
// List contributors
// List languages
// List Teams
// List Tags
// List Branches
// Get Branch
// Delete a Repository

