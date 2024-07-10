function getFormInfo(){
    var u=document.forms["regist"]["uname"].value;
    console.log(u);
    var p=document.forms["regist"]["password"].value;
    $.post("http://localhost:8099/regist/add",{uname:u,password:p},function(data,status){
        if (status) {
            alert("注册成功！");
        window.location.href="登录.html";
        }
        else
            alert("error!");
        // window.location.href="主页.html?uname="+ u;
    });
}