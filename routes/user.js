var http = require('http')
var util = require('util')
var x2js = require('xml2js')
var db   = require("../db")

function xml(req, res, next){
    host = "http://www.die2nite.com"
    path = util.format("/xml/ghost?k=%s;sk=%s", req.body.key, process.env.sk)
    http.get(host+path, function(rep){
        data = ""
        rep.on('data', function(chunk){ data += chunk })
        rep.on('end', function(){
            x2js.parseString(data, function(err, soul){
                user = soul.hordes.headers[0].owner[0].citizen[0].$
                db.user.getId(user.id, function(err, id){
                    if(!req.session.me) req.session.me = {}
                    req.session.setup = !id
                    res.redirect( (id) ?'/login' :'/user/setup' )
                })
            })
        })
        rep.on('error', function(err){
            next(err)
        })
    })
}

function ask_data(req, res){
    var tpl_val = Object.create(req.session)
    res.render("setup.html", tpl_val)
}
function get_data(req, res){
    key = ['ranking', 'contact', 'offline']
    for(i in key){
        req.session.me[key[i]] = (req.body.preset) ? true : !!req.body[key[i]]
    }
    res.redirect("/login")
}

function name(req, res){
    db.user.read(req.params.id, function(err, user){
        res.send(err?"":user.name)
    })
}

this.handle = function setup(app){
	app.post('/', xml)
	app.get ('/user/setup', ask_data)
	app.post('/user/setup', get_data)
	app.get ('/user/:id/name', name)
}

