var util  = require("util")
var async = require("async")
var c = require("./client.js")
var self = this

/** Achievement
 * id:     a unique string to identify the achievement. Can be shared
 * type:   image | icon | prefix | suffix | title
 * data:   the url of an image/icon or the text of a title.
 * name:   the name of the rewards.
 * points: how great is the achievement. Do not sum to 1000
 * stat:   the stat needed to unlock the achievement.
 * score:  how many of the stat is required
 **/

var members = ["type","data","name","points","stat","score"]

this.read = function read(id, cb){
	if(id == null) return cb(new SyntaxError("id cannot be null"))
	// hoard everything from everywhere
	if(id.site == "*"){
		//TODO get all site, for each grab each achievement
		return
	}
	// hoard everything from a single site
	if(id.achievement == "*"){
		console.log("hoarding")
		c.r.smembers("site:"+id.site+":achievements", function(err, result){
			if(err) return cb(err)
			async.concat(result, function(achiv, next){
				self.read({site:id.site, achievement:achiv}, next)
			}, cb)
		})
		return
	}
	// grab a specific achievement
	c.r.hgetall("site:"+id.site+":"+id.achievement, cb)
}
this.write = function write(what, cb){
	// batch processing
	if(util.isArray(what)) return async.concat(what, self.write, cb)
	// error management
	if(!what || !what.id || !what.site) 
		return cb(new SyntaxError("id and site are required"))
	// caching if the achievements is already known
	c.r.sismember("site:"+what.site+":achievements", what.id, function(err, res){
		if(err) return cb(err)
		//TODO check if cache invalidation is optimal
		if(res === 1 && (Math.floor(Math.random()*0xFF) <= 0x02) ){
			return (cb)?cb(null, true):null
		}
		// adding data
		payload = {}
		members.forEach(function(item){
			if(what[item]) payload[item] = what[item]
		})
		// mutli ensure atomicity of operation.
		c.r.multi()
			.sadd("site:"+what.site+":achievements", what.id)
			.hmset("site:"+what.site+":"+what.id, payload)
			.exec(cb)
	})
}
this.erase = function erase(what, cb){
//	return c.d.remove(id, rev, cb)
}

this.process = function process(sid, raw, cb){
	if(raw.data.type == "default") return
	achiv = {	id: raw.id, site: sid, name: raw.name, 
		stat:raw.stat, score: raw.score, points: raw.points }
	if(raw.data.type == "image" || raw.data.type == "icon"){
		achiv.type = raw.data.type
		achiv.data = raw.data.url
	}
	if(raw.data.type == "title") {
		achiv.type = (raw.data.suffix)?"suffix":(raw.data.prefix)?"prefix":"title"
		achiv.data = raw.data.title
	}
	self.write(achiv, cb)
}
