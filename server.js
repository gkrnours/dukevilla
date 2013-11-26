#!/bin/env node
/**
 * Module dependencies.
 */

var express = require('express');
var swig    = require('swig');
var http    = require('http');
var path    = require('path');
var routes  = require('./routes/index.js');

var app = express();

// all environments
app.engine('html', swig.renderFile)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')
app.set('view cache', false)
swig.setDefaults({cache: false})
app.set('port', process.env.PORT || 8080)
app.use(express.favicon())
app.use(express.logger('dev'))
app.use(express.bodyParser())
app.use(express.methodOverride())
app.use(express.cookieParser('langsoc is watching'))
app.use(express.session())
app.use(app.router)
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

routes.setup(app)
//app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
