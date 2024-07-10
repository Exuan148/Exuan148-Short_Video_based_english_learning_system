function getaccessed(){
    var u=document.forms["login"]["uname"].value;
    var p=document.forms["login"]["password"].value;
    //验证
    //提交登录信息
    $.post("http://localhost:8099/login/vertify",{uname:u,password:p},function(data,status){
        if(status){
            var uid=data[0]["uid"];
            if(uid=="not"){
                alert("找不到账户！");
            }
            else{
                $.post("http://localhost:8099/login/status",{uid:uid,vname:"用户登录"},function (data,status) {
                    if (!status){
                        alert("提交状态error！")
                    }
                });
                window.location.href="主页.html?uid="+ uid+"&uname="+u+"&password="+p+"&method="+"recommend";

            }
        }
        else{
            alert("error!");
        }
    });
}