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

ADMIN = [3607225, 558368]
function admin(user){
    return ADMIN.indexOf(user.id) !== -1
}

function select(page, target){
    return (page == target)?"select":""
}

this.extend = function extend(swig){
    swig.setFilter('toPicto', picto)
    swig.setFilter('isAdmin', admin)
    swig.setFilter('select', select)
}
