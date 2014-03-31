var async   = require('async')
var db = require('../db')

//var SITE = 6 // Hordes
var SITE = 7 // Die2Nite
var auth    = require('twinauth')("https://twinoid.com/graph/me?fields="
        +"name,id,"
        +"sites.filter("+SITE+").fields(link,realId,"
            +",stats.fields(id,score,name,icon,description,rare,social)"
            +",achievements.fields("
                +"id,name,stat,score,points,description,date,index"
                +",data.fields(type,title,url,prefix,suffix))"
            +")")

function login(req, res, next){
    if(!req.session.me) return next()
    if(req.session.me.contact) req.scope = ['contacts']
    if(req.session.me.offline) req.offline = true
    next()
}

function out(req, res, next){
    req.session.destroy()
    res.redirect('/')
}

function getUser(req, res, next){
    if(req.session.setup){
        req.session.me.id   = req.json.id
        req.session.me.name = req.json.name
        req.session.me.hid  = req.json.sites[0].realId
        req.user = req.session.me

        db.user.setId(req.session.me, function(){})
        db.user.write(req.session.me, next)
    } 
    else {
        db.user.read(req.json.id, function(err, user){
            req.user = user
            req.session.me = user
            next()
        })
    }
}

function parse_rank(stats, user){
    async.map(stats, 
        function(data, next){
            next(null,{stat:data.id, score:data.score, user:user.id})
        }, 
        function(err, res){ db.rank.write(res, function(){}) }
    )
}
function parse_achiev(achievements, user){
    async.each(achievements, 
        db.achievement.process.bind(null, user.id),
        function(){ }
    )
}
function parse(req, res, next){ 
    data = req.json.sites[0]
    if(req.user.ranking) parse_rank(data.stats, req.user)
    parse_achiev(data.achievements, req.user)
    db.stat.write(data.stats, function(){})
    next()
}

function redirect(path){ return function(req, res){ res.redirect(path) } }

this.handle = function setup(app){
	app.get('/login', login, auth.go)
	app.get('/back',   auth.back, getUser, parse, redirect('/rank') )
    app.get('/logout', out)
}

