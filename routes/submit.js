function form(req, res){
	res.render('submit', { title: 'Express' })
}
function form(req, res){
	res.redirect('/submit')
}

this.handle = function setup(app){
	app.get('/submit', form)
//	app.post('/submit', save)
}

