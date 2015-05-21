var $ = require('cheerio');
var fs = require('fs-extra');
var path = require("path");
var MD5 = require("MD5");
var request = require("request");


var encoding = {
    encoding: "utf8"
};

function main() {

    var baseDir = path.resolve(__dirname, "../data", "雅安樱桃");
    var file = path.resolve(baseDir, "s.html");
    var cleand_file = path.resolve(baseDir, "s_clean.html");

    var html = fs.readFileSync(file).toString();
    //console.log(fs);

    //console.log($("img"));
    var newHtml=html.replace(/data\-src/ig,"src");

    //var newHtml = parseCSSJS(html, baseDir);
    parseImg(newHtml,baseDir, function(imgs) { //把所有的img都处理完以后
        for(var i=0;i<imgs.length;i++){
            var img=imgs[i];
            var src=img.src;
            var map=img.map;
            if(!map){
                console.log("");
            }
            else{
                newHtml=newHtml.replace(src,map);
            }
        }
        fs.outputFileSync(cleand_file, newHtml, encoding);
    })
}



function parseCSSJS(html, baseDir) {
    var links = html.match(/<link[^>]*?>/ig);
    //console.log(links);
    for (var i = 0; i < links.length; i++) {
        var link = $.parseHTML(links[i])[0];
        var attrs = link.attribs;
        //console.log(link);
        if (attrs && attrs.rel == "stylesheet") {
            console.log(attrs.href);
            if (!attrs.href || !attrs.href.match(/^http/ig)) {
                continue;
            }
            var fileName = getAndSaveFile(attrs.href, baseDir, "css");
            //console.log("fileName", fileName);
            attrs.href = fileName;
            var replacedFile = links[i].replace(/href="[^"]*?"/ig, 'href="' + fileName + '"');
            html = html.replace(links[i], replacedFile);
            //console.log("new html",$.html());
            //html.replace(link,);
        }
    }
    var scripts = html.match(/<script[^>]*?>/ig);
    console.log("scripts", scripts);
    for (var i = 0; i < scripts.length; i++) {
        var script = scripts[i];
        var src = getAttr(script, "src");
        if (!src || !src.match(/^http/ig)) {
            continue;
        }
        var fileName = getAndSaveFile(src, baseDir, "js");
        //console.log("fileName", fileName);
        var replacedFile = setAttr(script, "src", fileName);
        html = html.replace(scripts[i], replacedFile);
    }

    return html;
}


function parseImg(html,baseDir,cb) {
    var imgs = html.match(/<img[^>]*?>/ig);
    console.log("imgs", imgs);
    var realImgs = [];
    for (var i = 0; i < imgs.length; i++) {
        var item = imgs[i];
        var src = getAttr(item, "src") || getAttr(item, "data-src");
        console.log("img.src=[" + src + "]");
        if (!src || !src.match(/^http/ig)) {
            //如果是base 64 直接另存为图片

            continue;
        } else {
            realImgs.push({
                html: item,
                src: src
            });
        }
    }
    console.log("realImgs:");
    getImageFile(realImgs, baseDir, "img", function() {
        //console.log("realImgs",realImgs);
        cb(realImgs);
    });
}

function getAttr(str, attr) {
    var attrValue;
    var reg = new RegExp(attr + "=[\"]([^\"]*)?[\"]", "ig");
    var reg2 =new RegExp(attr + "=[\']([^\']*)?[\']", "ig");
    //console.log("reg", reg);
    var result = reg.exec(str);
    var result2 = reg2.exec(str);
    // console.log(result);
    if (result) {
        attrValue = result[1];
    }
    if (result2) {
        attrValue = result2[1];
    }
    //console.log("attrValue", attrValue);
    return attrValue;

}

function setAttr(str, attr, value) {
    var result;
    var reg = new RegExp(attr + "=[\"|\'](.*)?[\"|\']", "ig");
    if (reg.test(str)) { //如果已经包含
        result = str.replace(reg, attr + "=\"" + value + "\"");
    } else {
        result = str.replace(/>$/, " " + attr + "=\"" + value + "\">");
    }

    return result;
}


function saveBase64(src) {


}

function getFile(url, cb) {
    var request = require('urllib-sync').request;

    var res = request(url);
    //console.log(res);
    console.log(res.headers["content-type"]);
    var type = res.headers["content-type"] || "";
    return {
        type: type.toString(),
        data: res.data
    };
    //res.data.toString();
    //console.log(res.data.toString());
}

function getImageFile(imgs, baseDir, fileType, cb) {
    var request = require('request');
    var opt = {
        encoding: null
    };
    var j = 0;
    console.log("imgs.length="+imgs.length);
    for (var i = 0; i < imgs.length; i++) {
        var url = imgs[i].src;
        console.log("img url= "+i+" ["+url+"]");
        request(url, opt, function(err, res, body) {
            j++;
            if (err) {

            } else {
                //console.log(body);
                //console.log(res.headers["content-type"]);
                var type = res.headers["content-type"] || "";
                var imgType = type.replace("image/", "");
                var md5Name = MD5(body).substr(0,6);
                var fileName = md5Name + "." + imgType;
                console.log("img FileName "+j+" :[" + fileName + "]");
                
                try {
                    var target = path.resolve(baseDir, fileType, fileName);
                    fs.outputFileSync(target, body);
                } catch (e) {
                    console.log("saveImgFile error", e);
                }

                this.map="img/"+fileName;
                if(j==imgs.length){
                    cb();
                }
            }
        }.bind(imgs[i]));
    }
}


function getAndSaveFile(url, baseDir, fileType) {
    var file = getFile(url);
    var imgType = "";
    console.log("file.type", file.type);
    if (file.type.match(/^image/ig)) {
        imgType = file.type.replace("image/", "");

    }
    var content = file.data.toString();
    var fileName = url.replace(/[\?\#].*$/, "");
    fileName = fileName.substring(fileName.lastIndexOf("/") + 1);
    var md5Name = MD5(file.data);
    if (imgType) {
        fileName = md5Name + "." + imgType;
    }
    console.log(fileName);
    try {
        var target = path.resolve(baseDir, fileType, fileName);
        if (fileType == "img") {
            fs.outputFileSync(target, content);
        } else {
            fs.outputFileSync(target, content, encoding);
        }
    } catch (e) {
        console.log("saveFile error", target);
    }

    return fileType + "/" + fileName;
}

var url = "http://mmbiz.qpic.cn/mmbiz/lWNl5icgL8dOa2GkbbBafcMvfupicpUicoWZh3Dy4YUnVUe4eHhB23icdLJ9ffRa7MVibNSepdKB5myGmOSibkiafibITA/0";

main();
//getImageFile(url);
//getAndSaveFile(url);
//getFile();