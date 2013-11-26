var async   = require('async')
var db = {}
    db.rank = require('../db/rank.js')
    db.stat = require('../db/stat.js')
var auth    = require('twinauth')("https://twinoid.com/graph/me?fields="
        +"name,id,"
        +"sites.filter(6).fields(link"
            +",stats.fields(id,score,name,icon,description,rare,social)"
            +",achievements.fields(id,name,stat,score,points,npoints))",
            function(json){ 
                data = json.sites[0]
                async.map(data.stats, function(d, c){
                        c(null,{stat:d.id, score:d.score, user:json.name})
                    }, 
                    function(err, res){ db.rank.write(res, function(){}) }
                )
                db.stat.write(data.stats, function(){})
            } )

function form(req, res){
	res.render('submit', { title: 'Express' })
}
function form(req, res){
	res.redirect('/submit')
}

this.handle = function setup(app){
	app.get('/signin', auth.go)
	app.get('/back',   auth.back, function(req, res){ res.redirect("/") })
}

