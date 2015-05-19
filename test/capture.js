// JavaScript Document



function main(){
	var request=require("request");
	var path=require("path");
	var baseDir=path.resolve(__dirname,"../data");
	var saveDir="雅安樱桃";
	var fileName="s.html";
	var fs=require("fs-extra");
	var encoding={encoding:"utf8"};

	//console.log("request",request);
	var url="http://mp.weixin.qq.com/s?__biz=MjM5ODE3NDg2MQ==&mid=206379097&idx=3&sn=aa1fb761e757b3ab862ad8191b5b5078&scene=1&from=groupmessage&isappinstalled=0#rd";
	request(url,function(err, response, body){
		if(err){

		}
		else{//识别页面中的url资源 替换成本地的资源
			console.log("body",body.length);
			var target=path.resolve(baseDir,saveDir,fileName);
			console.log("target",target);
			fs.outputFileSync(target,body,encoding);
		}
	})
}

main();