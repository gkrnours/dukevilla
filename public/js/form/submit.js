document.on("dom:loaded", function(){
	file  = $$("input[name=\"icon\"]")[0]
	tag   = $$("input[name=\"tag\"]")[0]
	title = $$("input[name=\"title\"]")[0]

	icon  = new Element("img", {src:"/img/icon.png"})
	wrap  = icon.wrap({class:"icon"})
	wrap.on("click", function(ev, el){ file.click(); ev.stop() })
	file.on("change", function(ev, el){ 
		if(el.files){
			f = el.files[0]
			icon.src = window.URL.createObjectURL(f)
			console.log(f)
		}
	})

	title.addClassName("shorter")
	tag.insert({before: wrap})
	
})
