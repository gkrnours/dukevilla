var util  = require("util")
var async = require("async")
var c = require("./client.js")
var stat = require("./stat.js")
var self = this

/** Rank
 * map of score:name
 **/

this.read = function read(id, cb){
    if(id == null) { 
        stat.read('list', function(err, type){
            async.reduce(type, {}, function(data, stat, next){
                process.nextTick(function(){
                    self.read(stat, function(err, res){ 
                        data[stat] = res
                        next(err, data) 
                    })
                })
            }, cb)
        })
        return
    }
    c.r.zrevrange("rank:"+id, 0, 100, "withscores", function(err, result){
        if(err) return cb(err)
        data = []
        for(i=0, l=result.length; i<l; i+=2){
            data.push({name:result[i+0], score:result[i+1]})
        }
        cb(null, data)
    })
}
this.write = function write(what, cb){
	// batch processing
	if(util.isArray(what)) return async.concat(what, self.write, cb)
	// error management
	if(!what || !what.stat || !what.score || !what.user) 
		return cb(new SyntaxError("stat, score and user are required"))
	// caching if the achievements is already known
	c.r.zadd("rank:"+what.stat, what.score, what.user, function(err, res){
		if(err) return cb(err)
        cb()
	})
}
this.erase = function erase(what, cb){
    stat.read('list', function(err, stats){  
        async.map(stats, function(stat, done){
            done(null, 'rank:'+stat)
        }, function(err, keys){
            console.log(keys)
            c.r.del(keys, cb)
        })
    })
}
