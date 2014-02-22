#!/bin/env node
/**
 * Module dependencies.
 */

var express = require('express');
var swig    = require('swig');
var http    = require('http');
var path    = require('path');
var routes  = require('./routes/index.js');
var filter  = require('./views/filter.js');

var app = express();

// all environments
app.engine('html', swig.renderFile)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')
app.set('view cache', false)
swig.setDefaults({cache: false})
filter.extend(swig)
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080)
app.set('host', process.env.OPENSHIFT_NODEJS_IP || null)
app.use(express.favicon('public/img/favicon.ico'))
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
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


http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
