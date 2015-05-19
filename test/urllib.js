var request = require('urllib-sync').request;
 
var res = request('http://www.nongfadai.com');
console.log(res.data.toString());