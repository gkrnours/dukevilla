var util  = require("util")
var async = require("async")
var c = require("./client.js")
var self = this

/** Picto
 * id: string
 * name: string
 * icon: string
 * description: string
 * rare: bool
 * social: bool
 **/

this.read = function read(id, cb){
    if(id == null) { 
        c.r.smembers('stat', function(err, res){
            async.reduce(res, {}, function(data, id, next){
                self.read(id, function(err, res){ 
                    data[id] = res
                    next(err, data)
                })
            }, cb)
        })
        return
    }
    if(id == 'list') { 
        c.r.smembers('stat', cb)
        return
    }
    c.r.hgetall("stat:"+id, cb)
}
this.write = function write(what, cb){
	// batch processing
	if(util.isArray(what)) return async.concat(what, self.write, cb)
	// error management
	if(!what || !what.id) 
		return cb(new SyntaxError("id is required"))
    if(what.icon && what.icon.url)
        what.icon = what.icon.url
    c.r.multi()
        .sadd('stat', what.id)
	    .hmset('stat:'+what.id, what)
        .exec(cb)
}
this.erase = function erase(what, cb){
    if(what == null){
        // clean the db of all stat
        c.r.smembers('stat', function(err, res){
            if(err) return cb(err)
            c.r.del(res, cb)
        })
    }
}
