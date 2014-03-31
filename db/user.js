var util  = require("util")
var async = require("async")
var c = require("./client.js")
var self = this

/** User
 * id: string
 * name: string
 * ranking: bool // Does they want to be ranked?
 * contact: bool // Does they want to update contacts list ?
 * offline: bool // Does they want to be updated magically ?
 **/

this.read = function read(id, cb){
	if(id == null) return cb(new SyntaxError("id is required"))
    if(util.isArray(id)){
        async.concat(id, read, cb)
    } else {
        c.r.hgetall("user:"+id, cb)
    }
}
this.write = function write(who, cb){
	// error management
	if(!who || !who.id || !who.name) 
		return cb(new SyntaxError("id is required"))
    c.r.multi()
	    .hmset('user:'+who.id, who)
        .exec(cb)
}
this.erase = function erase(what, cb){
    // TODO
}

this.setId = function setId(user, cb){
	if(!user || !user.id || !user.hid) 
		return cb(new SyntaxError("id and hid are required"))
    c.r.set("user:hid:"+user.hid, user.id, cb)
}
this.getId = function getId(hid, cb){
    c.r.get("user:hid:"+hid, cb)
}

