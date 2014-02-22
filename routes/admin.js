var db_rank = require("../db/rank.js")
var db_stat = require("../db/stat.js")

function panel(req, res){
    db_stat.read(null, function(err, lstat){
        res.render('admin', { stats: lstat, pseudo: " " })
    })
}
function form(req, res){
	res.redirect('/submit')
}

this.handle = function setup(app){
	app.get('/adm', panel)
}

