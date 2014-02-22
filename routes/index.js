var fs = require('fs')
var modules = fs.readdirSync(__dirname).map(function(i){ 
	return require("./"+i)
})


this.setup = function setup(app){
	modules.forEach(function(i){ i.handle(app) })
}
this.handle = function(app){
	app.get('/', function(req, res){ res.render('index', req.session) })
}
