var util  = require("util")
var async = require("async")
var c     = require("./client.js")
var stat = require("./stat.js")
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
	//if(id == null) return cb(new SyntaxError("id cannot be null"))
    switch(id){
        case '*': // hoard everything
            stat.read('list', function(err, stats){
                if(err) return cb(err)
                async.reduce(stats, {}, function(data, stat, next){
                    self.read(stat, function(err, res){
                        data[stat] = res
                        next(err, data)
                    })
                }, cb)
            })
            break
        default:
            // grab achievements for a stat
            c.r.get('achievements:'+id, function(err, nber){
                if(!nber) return cb(err)
                t = []
                for(i=0; i<nber; i++){ t.push(i) }
                async.map(t, function(idx, next){
                    c.r.hgetall('achievement:'+id+':'+idx, next)
                }, cb)
            })
	} // end switch
}
this.write = function write(what, cb){
	// batch processing
	if(util.isArray(what)) return async.concat(what, self.write, cb)
	// error management
	if(!what || !what.stat || !what.idx) 
		return cb(new SyntaxError("stat and idx are required"))
	// caching if the achievements is already known
	c.r.hgetall('achievement:'+what.stat+':'+what.idx, function(err, res){
		if(err) return cb(err)
        KEYN = 'achievement:'+what.stat
        KEY  = KEYN+':'+what.idx
		// multi ensure atomicity of operation.
		var request = c.r.multi()
        if(res === null) {
            c.r.get(KEYN, function(err, res){
                if(res != null && res < what.idx)
                request.set(KEYN, what.idx)
            })
            request.hmset(KEY, what)
        } else if(what.date < res.date ) {
            request.hmset(KEY, 'date', what.date, 'user', what.user)
        }
		//TODO check if cache invalidation is optimal
		//if(res === 1 && (Math.floor(Math.random()*0xFF) <= 0x02) ){
		//	return (cb)?cb(null, true):null
		//}

		//	.hmset("site:"+what.site+":"+what.id, payload)
        request.exec(cb)
	})
}
this.erase = function erase(what, cb){
//	return c.d.remove(id, rev, cb)
}

this.process = function process(user, raw, cb){
	if(raw.data.type == "default") return
	achiv = { idx:raw.index, name:raw.name, 
		      stat:raw.stat, score:raw.score,   desc:raw.description, 
              date:raw.date, points:raw.points, user:user }
	if(raw.data.type == "image" || raw.data.type == "icon"){
		achiv.type = raw.data.type
		achiv.data = raw.data.url
	}
	if(raw.data.type == "title") {
		achiv.type = raw.data.suffix?"suffix":raw.data.prefix?"prefix":"title"
		achiv.data = raw.data.title
	}
	self.write(achiv, cb)
}
