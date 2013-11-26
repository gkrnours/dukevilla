var db_rank = require("../db/rank.js")
var db_stat = require("../db/stat.js")

function list(req, res){
    db_stat.read(null, function(err, lstat){
        res.render('rank', { stats: lstat, pseudo: " " })
    })
}
function rank(req, res){
    db_stat.read(null, function(err, lstat){
        db_rank.read(req.params.stat, function(err, lrank){
            res.render('rank', { stats: lstat, rank: lrank, pseudo: " " })
        })
    })
}
function total(req, res){
    db_stat.read(null, function(err, lstat){
        db_rank.read(null, function(err, lrank){
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

