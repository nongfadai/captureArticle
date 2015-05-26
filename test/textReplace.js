var fs=require("fs-extra");
var path=require("path");
var target=path.resolve(__dirname,"src/a.css");
var content=fs.readFileSync(target,{encoding:"utf8"});

content=content.replace(/-(\d*)px/ig,function(a,b,c){
	//console.log(a);
	return -(b/2)+"px"
})

console.log(content);