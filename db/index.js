var fs   = require('fs')
var path = require('path')

var dbs = fs.readdirSync(__dirname).reduce(function(data, file, idx){ 
    if(file == "index.js" || file == "client.js") return data
    return data[path.basename(file, ".js")] = require("./"+file), data
}, {})

for(x in dbs){
    this[x] = dbs[x]
}
