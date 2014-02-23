var db = {
    rank: require("../db/rank.js"),
    stat: require("../db/stat.js")
}

function panel(req, res){
    db.stat.read(null, function(err, lstat){
        res.render('admin', { stats: lstat, pseudo: " " })
    })
}
stat = {
    clean: function(req, res, next){
        db.stat.erase(null, function(err){
            if(err) return next(err)
            res.redirect("/adm")
        })
    }
}
function form(req, res){
	res.redirect('/submit')
}

this.handle = function setup(app){
	app.get('/adm', panel)
	app.post('/adm/stat/clean', stat.clean)
}

