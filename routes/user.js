var db = require("../db")

function join(req, res){
    db.user.read(req.session.me.id, function(err, user){
        if(user == null){
            res.redirect("/user/setup")
            return
        }
        tpl_val = {}
        tpl_val.dbg = [req.session.me.id,user]
        res.render("dbg.html", tpl_val)
    })
}
function ask_data(req, res){
    var tpl_val = Object.create(req.session)
    res.render("setup.html", tpl_val)
}
function get_data(req, res){
    //console.log(req.body)
    user = req.session.me
    for(key in ['ranking', 'contact', 'offline']){
        user[key] = (req.body.preset) ? true : !!req.body[key]
    }
    db.user.write(user)
    res.redirect("/rank")
}

function name(req, res){
    db.user.read(req.params.id, function(err, user){
        res.send(err?"":user.name)
    })
}

this.handle = function setup(app){
	app.get('/user/join', join)
	app.get('/user/setup', ask_data)
	app.post('/user/setup', get_data)
	app.get('/user/:id/name', name)
}

