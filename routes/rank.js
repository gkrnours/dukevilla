var db_rank = require("../db/rank.js")
var db_stat = require("../db/stat.js")

function list(req, res){
    db_stat.read(null, function(err, lstat){
        var tpl_val = Object.create(req.session)
        tpl_val.stats = lstat
        tpl_val.page  = 'rank'
        console.log(tpl_val)
        res.render('rank', tpl_val)
    })
}
function rank(req, res){
    db_stat.read(null, function(err, lstat){
        db_rank.read(req.params.stat, function(err, lrank){
            var tpl_val = Object.create(req.session)
            tpl_val.stats = lstat
            tpl_val.rank  = lrank
            tpl_val.page  = 'rank'
            tpl_val.stat  = lstat[req.params.stat]
            tpl_val.select= req.params.stat,
            res.render('rank', tpl_val)
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

