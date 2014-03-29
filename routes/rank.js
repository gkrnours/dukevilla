var async = require('async')
var db    = require("../db")

function list(req, res){
    db.stat.read(null, function(err, lstat){
        var tpl_val = Object.create(req.session)
        tpl_val.stats = lstat
        tpl_val.page  = 'rank'
        target = "rank."+req.accepts('html', 'json')
        res.render(target, tpl_val)
    })
}
function rank(req, res){
    db.stat.read(null, function(err, lstat){
        db.rank.read(req.params.stat, function(err, lrank){
            async.reduce(lrank, {}, function(data, item, next){
                db.user.read(item.name, function(err, user){
                    if(err) return next(err)
                    if(!user) return next(new Error())
                    data[user.id] = user
                    next(err, data)
                })
            }, function(err, luser){
                var tpl_val = Object.create(req.session)
                tpl_val.stats = lstat
                tpl_val.list  = lrank
                tpl_val.users = luser
                tpl_val.page  = 'rank'
                tpl_val.stat  = lstat[req.params.stat]
                tpl_val.select= req.params.stat
                target = "rank."+req.accepts('html', 'json')
                res.render(target, tpl_val)
            })
        })
    })
}
function total(req, res){
    db.stat.read(null, function(err, lstat){
        db.rank.read(null, function(err, lrank){
            res.render('rank', { rank: lrank, stats: lstat, pseudo: " " })
        })
    })
}
function form(req, res){
	res.redirect('/submit')
}

this.handle = function setup(app){
	app.get('/rank', list)
	app.get('/rank/:stat', rank)
}

