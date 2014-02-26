
function mkDom(stat, rank, where){
    h2 = document.createElement('h2')
    h2.textContent = "Ranking"

    picto = document.createElement('img')
        $(picto).attr('src', stat.icon).attr('alt', stat.name)
        $(picto).addClass("picto rare")
    title = document.createElement('h3')
        $(title).append(picto).append(" "+stat.name)
    desc = document.createElement('p')
        $(desc).append(stat.description)
    list = document.createElement('dl')
        $(rank).each(function(i, item){
            dt = document.createElement('dt')
                $(dt).append(item.score)
            dd = document.createElement('dd')
                $(dd).append(item.name)
            $(list).append(dt).append(dd)
        })
    sect = document.createElement('section')
        $(sect).attr('id', "rank").addClass("list")
        $(sect).append(title).append(desc).append(list)
    
    $(where).empty()
    $(where).append(h2).append(sect)
}
Zepto(function($){
    db = {}
    $('#list').on('click', 'a', function(e){
        cont = $('.part').last()
        target = $(this).attr('href')

        if(typeof(db[target]) == 'undefined'){
            $.getJSON(target, function(data){
                db[target] = data
                mkDom(data.stat, data.rank, cont)
            })
        } else {
            data = db[target]
            mkDom(data.stat, data.rank, cont)
        }
        return false
    })
    $('#stats').addClass("short")
})
