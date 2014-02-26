#!/bin/env node
/**
 * Module dependencies.
 */

var express = require('express')
var rStore  = require('connect-redis')(express)
var swig    = require('swig')
var http    = require('http')
var path    = require('path')
var routes  = require('./routes/index.js')
var filter  = require('./views/filter.js')
var c       = require('./db/client.js')

var app = express();

// all environments
app.engine('html', swig.renderFile)
app.engine('json', swig.renderFile)
app.set('views', __dirname + '/views')
app.set('view engine', 'html')
app.set('view cache', 'memory')
filter.extend(swig)
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 8080)
app.set('host', process.env.OPENSHIFT_NODEJS_IP || null)
app.use(express.favicon('public/img/favicon.ico'))
app.use(express.logger('dev'))
app.use(express.json())
app.use(express.urlencoded())
app.use(express.cookieParser('langsoc is watching'))
app.use(express.session({store: new rStore({client: c.r}), secret: 'kitty'}))
app.use(app.router)
// production only
if('development' != app.get('env')){
    week = 1000*60*60*24*7
    app.use(express.static(path.join(__dirname, 'public'), {maxAge: week}));
}
// development only
if ('development' == app.get('env')) {
  app.use(express.static(path.join(__dirname, 'public')));
  swig.setDefaults({cache: false})
  app.use(express.errorHandler());
}

routes.setup(app)
//app.get('/', routes.index);


http.createServer(app).listen(app.get('port'), app.get('host'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
