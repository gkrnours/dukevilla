var async   = require('async')
var db = {}
    db.achievement = require('../db/achievements.js')
    db.rank = require('../db/rank.js')
    db.stat = require('../db/stat.js')

//var SITE = 6 // Hordes
var SITE = 7 // Die2Nite
var auth    = require('twinauth')("https://twinoid.com/graph/me?fields="
        +"name,id,"
        +"sites.filter("+SITE+").fields(link"
            +",stats.fields(id,score,name,icon,description,rare,social)"
            +",achievements.fields("
                +"id,name,stat,score,points,description,date,index"
                +",data.fields(type,title,url,prefix,suffix))"
            +")")

function out(req, res, next){
    req.session.destroy()
    res.redirect('/')
}
function parse_rank(stats, user){
    async.map(stats, 
        function(data, next){
            next(null,{stat:data.id, score:data.score, user:user})
        }, 
        function(err, res){ db.rank.write(res, function(){}) }
    )
}
function parse_achiev(achievements, user){
    async.each(achievements, 
        db.achievement.process.bind(null, user),
        function(){ }
    )
}
function parse(req, res, next){ 
    data = req.json.sites[0]
    parse_rank(data.stats, '@'+req.json.id+':'+req.json.name)
    parse_achiev(data.achievements, '@'+req.json.id+':'+req.json.name)
    db.stat.write(data.stats, function(){})

    req.session.me = {name:req.json.name, id:req.json.id}
    next()
}

function redirect(path){ return function(req, res){ res.redirect(path) } }

this.handle = function setup(app){
    app.post('/', redirect("/") )
	app.get('/login', auth.go)
	app.get('/back',   auth.back, parse, redirect("/rank") )
    app.get('/logout', out)
}

