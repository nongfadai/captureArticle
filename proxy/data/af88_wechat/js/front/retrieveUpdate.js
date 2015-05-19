$(function () {
	$("#btnsubmit").click(function(){
		if(valicheck()){
			var param = getParams();
			valiupdatecode(param);
		}
	});
	$("#onepassword").blur(function() {
		if ($("#onepassword").val() == "") {
			$("#s_tip").html("新密码不能为空");
		} else if ($("#onepassword").val().length < 6 || $("#onepassword").val().length > 20) {
			$("#s_tip").html("密码长度必须为6-20个字符");
		} else {
			$("#s_tip").html("");
		}
	});
	$("#twopassword").blur(function() {
		if ($("#twopassword").val() == "") {
			$("#sw_tip").html("确认密码不能为空");
		}
		if ($("#twopassword").val() != $("#onepassword").val()) {
			$("#sw_tip").html("两次密码不一致");
		} else {
			$("#sw_tip").html("");
		}
	});
});
function valicheck(){
	if($("#onepassword").val() == ""){
	 	return false;
	}
	if($("#twopassword").val() == ""){
		return false;
	}
	if($("#twopassword").val() != $("#onepassword").val()){
		return false;
	}
	return true;
}
function getParams(){
	var onepwd = RSAUtils.pwdEncode($("#onepassword").val());
	var twopwd = RSAUtils.pwdEncode($("#twopassword").val());   
	return "onepwd="+onepwd+"&twopwd="+twopwd;
}
function valiupdatecode(param){
var urlstr = "retrieveupdate.do";
	if(arictype != null && arictype == "paycode"){
		urlstr = "forgetwidthdraw.do";
	}
	$.ajax({
			 	type:"post",
			 	url:urlstr,
			 	data:param,
			 	success:succupdatefun
			 });
}
function succupdatefun(data){
	if(data.key == 1){
		window.location.href = "retrievefinal.do?arictype="+arictype;
	}else{
		$.dialog.commonTips(data.value);
	}
}
