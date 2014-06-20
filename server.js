var express = require("express");

var Mustache = require('mustache');
var resumeToText = require('resume-to-text');
var resumeToHTML = require('resume-to-html');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser());
var fs = require('fs');
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();
app.all('/*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});
app.get('/resume/user/:username.:format', function(req, res) {
	var resume = JSON.parse(fs.readFileSync(req.params.username + '.json', 'utf8'));
	console.log(req.params.format);
  	var format = req.params.format;

  	var content = '';
  	switch(format) {
  		case 'json':
  			content =  JSON.stringify(resume, undefined, 4);
  			res.send(content);
  			break;
  		case 'txt':
  			content = resumeToText.resumeToText(resume, function (plainText){
  				res.set({'Content-Type': 'text/plain',
  					'Content-Length': plainText.length});

  				res.set('Cba', 'text/plain');
  				res.type('text/plain')
				res.send(200,plainText);
  			});
  			break
  		default:
  			resumeToHTML(resume, function (content){
  				res.send(content);
  			});

  	}

});
var resumes = {};
app.get('/resume/:uid.:format', function(req, res) {
	console.log(resumes);
	var resume = resumes[req.params.uid];
	console.log(req.params.format);
  	var format = req.params.format;

  	var content = '';
  	switch(format) {
  		case 'json':
  			content =  JSON.stringify(resume, undefined, 4);
  			res.send(content);
  			break;
  		case 'txt':
  			content = resumeToText.resumeToText(resume, function (plainText){
  				res.set({'Content-Type': 'text/plain',
  					'Content-Length': plainText.length});

  				res.set('Cba', 'text/plain');
  				res.type('text/plain')
				res.send(200,plainText);
  			});
  			break
  		default:
  			resumeToHTML(resume, function (content){
  				res.send(content);
  			});

  	}

});
app.post('/resume', function (req, res) {
	var uid = guid();
	console.log(req.body);
	resumes[uid] = req.body && req.body.resume || {};
	res.send({url:'http://registry.jsonresume.org/resume/'+uid+'.html'});
});
var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
  console.log("Listening on " + port);
});