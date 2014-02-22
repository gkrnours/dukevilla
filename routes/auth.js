var async   = require('async')
var db = {}
    db.rank = require('../db/rank.js')
    db.stat = require('../db/stat.js')
//var SITE = 6 // Hordes
var SITE = 7 // Die2Nite
var auth    = require('twinauth')("https://twinoid.com/graph/me?fields="
        +"name,id,"
        +"sites.filter("+SITE+").fields(link"
            +",stats.fields(id,score,name,icon,description,rare,social)"
            +",achievements.fields(id,name,stat,score,points,npoints))")

function out(req, res, next){
    req.session.destroy()
    res.redirect('/')
}
function parse(req, res, next){ 
    data = req.json.sites[0]
    async.map(data.stats, function(d, c){
            c(null,{stat:d.id, score:d.score, user:req.json.name})
        }, 
        function(err, res){ db.rank.write(res, function(){}) }
    )
    db.stat.write(data.stats, function(){})
    req.session.me = {name:req.json.name, id:req.json.id}
    next()
}

this.handle = function setup(app){
	app.get('/login', auth.go)
	app.get('/back',   auth.back, parse, 
            function(req,res){ res.redirect("/rank") })
    app.get('/logout', out)
}

