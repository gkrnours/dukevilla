
function mkDom(data, where){
    stat = data.stat
    rank = data.rank
    users = data.user
    h2 = document.createElement('h2')
    h2.textContent = "Ranking"

    picto = document.createElement('img')
        $(picto).attr('src', stat.icon).attr('alt', stat.name)
        $(picto).addClass("picto").addClass((0 < stat.rare)?"rare":"")
    title = document.createElement('h3')
        $(title).append(picto).append(" "+stat.name)
    desc = document.createElement('p')
        $(desc).append(stat.description)
    list = document.createElement('dl')
        $(rank).each(function(i, item){
            dt = document.createElement('dt')
                $(dt).append(item.score)
            dd = document.createElement('dd')
                a = document.createElement('a')
                a.href="/user/"+item.name
                a.textContent = users[item.name].name
                $(dd).append(a)
            $(list).append(dt).append(dd)
        })
    sect = document.createElement('section')
        $(sect).attr('id', "rank").addClass("list")
        $(sect).append(title)
        $(sect).append(desc).append(list)
    
    $(".entry .select").removeClass("select")
    $("#"+stat.id).addClass("select")
    $(where).empty()
    $(where).append(h2).append(sect)
}
Zepto(function($){
    db = {}
    cont = $('.part').last()

    $(window).on('popstate', function(e){
        mkDom(e.state, cont)
    })

    $('#list').on('click', 'a', function(e){
        target = $(this).attr('href')

        if(typeof(db[target]) == 'undefined'){
            $.getJSON(target, function(data){
                db[target] = data
                mkDom(data, cont)
                if(history && history.pushState){
                    history.pushState(data, null, target)
                }
            })
        } else {
            data = db[target]
            mkDom(data, cont)
            if(history && history.pushState){
                history.pushState(data, null, target)
            }
        }
        return false
    })

    $('#stats').addClass("short")
})
