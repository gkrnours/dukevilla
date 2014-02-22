function picto(stat){
    if(typeof(stat) != 'object') return ""
    if(typeof(stat.icon) == 'undefined') return ""
    if(typeof(stat.rare) == 'undefined') return ""
    rare = (stat.rare==0)?"":" rare"
    return "<img src=\""+stat.icon+"\" "
               +"alt=\""+stat.name+"\" "
               +"class=\"picto"+rare+"\">"
}
picto.safe=true

ADMIN = [3607225]
function admin(user){
    return ADMIN.indexOf(user.id) !== -1
}

this.extend = function extend(swig){
    swig.setFilter('toPicto', picto)
    swig.setFilter('isAdmin', admin)
}