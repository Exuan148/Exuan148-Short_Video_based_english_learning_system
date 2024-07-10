$(function(){
    var gotopre=$(".quit");
    var LogAndRegistLag=$(".notlog");
    var welcome=$(".logstatus");
    gotopre.click(function(){
        window. location.href="主页.html";
    });
    if(typeof(mtd)=="undefined"||mtd=="recommend"){
        mtd="recommend";
        var recommendtag=document.getElementById("recommendtag");
        recommendtag.className="active";
    }
    if(mtd=="favorite"){
        var favoritetag=document.getElementById("favoritetag");
        favoritetag.className="active";
    }
    if(typeof(val)=="undefined"){
        val="default";
    }
    if(typeof(una)=="undefined"){
        una="default";
    }
    if(typeof(pwd)=="undefined"){
        pwd="default";
    }
    if(typeof(query_i)=="undefined"){
        query_i="";
    }
    if(typeof(query_f)=="undefined"){
        query_f="";
    }
    if(typeof(query_d)=="undefined"){
        query_d="";
    }

//是否登录
    if (val!="default") { //已经登录
        // alert("loged");
        LogAndRegistLag.css("display","none");
        welcome.css("display","block");
        welcome.html("Welcome "+una+" !");
        gotopre.css("display","block");
    }
    else{//未登录
        // alert("unloged");
        LogAndRegistLag.css("display","block");
        welcome.css("display","none");
        gotopre.css("display","none");
    }

    //先加载视频列表
    var videolist=document.getElementById("videolist");
    $.post("http://localhost:8099/videolist",{method:mtd,uid:val,uname:una,password:pwd,queryinput:query_i,queryfilm:query_f,queryduration:query_d},function (data,status) {
        if (!status){
            alert("提交状态error！")
        }
        else{
            // console.log(data);
            videolist.innerHTML="";
            for(var i=0;i<data.length;i++){
                videolist.innerHTML+="<div vname=\""+data[i]['vname'].toString()+"\" onclick=\"gotovideo('"+data[i]['vname'].toString()+"')\" style=\"padding-top:2em;\" class=\"col-md-3\">\n" +
                    "\t\t\t\t\t<div class=\"grid1\">\n" +
                    "\t\t\t\t\t\t<div class=\"view view-first\">\n" +
                    "\t\t\t\t\t\t\t<div class=\"index_img\"><img src=\"images/videolist_images/"+data[i]['vname'].toString()+".png\" class=\"img-responsive\" alt=\"\"/></div>\n" +
                    "\t\t\t\t\t\t\t<div class=\"sale\">"+data[i]['duration'].toString()+"</div>\n" +
                    "\t\t\t\t\t\t\t<div class=\"mask\">\n" +
                    "\t\t\t\t\t\t\t\t<div class=\"info\"><i class=\"search\"> </i>"+data[i]['firstsentence'].toString()+"</div>\n" +
                    "\t\t\t\t\t\t\t\t<ul class=\"mask_img\">\n" +
                    "\t\t\t\t\t\t\t\t\t<!--<li class=\"star\"><img src=\"images/star.png\" alt=\"\"/></li>-->\n" +
                    "\t\t\t\t\t\t\t\t\t<!--<li class=\"set\"><img src=\"images/set.png\" alt=\"\"/></li>-->\n" +
                    "\t\t\t\t\t\t\t\t\t<div class=\"clearfix\"> </div>\n" +
                    "\t\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t\t</div>\n" +
                    // "\t\t\t\t\t\t<i class=\"home\"></i>\n" +
                    "\t\t\t\t\t\t<div class=\"inner_wrap\">\n" +
                    "\t\t\t\t\t\t\t<h3 style='white-space: nowrap; overflow: hidden;text-overflow: ellipsis;'>"+data[i]['vtitle'].toString()+"</h3>\n" +
                    // "\t\t\t\t\t\t\t<ul class=\"star1\">\n" +
                    // "\t\t\t\t\t\t\t\t<h4 class=\"green\">难度：</h4>\n" +
                    // "\t\t\t\t\t\t\t\t<li><a href=\"#\"> <img src=\"images/star1.png\" alt=\"\"></a></li>\n" +
                    // "\t\t\t\t\t\t\t</ul>\n" +
                    "\t\t\t\t\t\t</div>\n" +
                    "\t\t\t\t\t</div>\n" +
                    "\t\t\t\t</div>"
            }
            videolist.innerHTML+="<div class=\"clearfix\"> </div>";
        }
    });
});

//先获取
var Request = new Object();
Request = GetRequest();
var val= Request["uid"];
var una= Request["uname"];
var pwd=Request["password"];
var mtd=Request["method"];
var query_f=Request["queryfilm"];
var query_d=Request["queryduration"];
var query_i=Request["queryinput"];
function gotovideo(vname){
    if (val!="default") {//已经登录
        window.location.href = "视频.html?uid=" + val + "&uname=" + una + "&password=" + pwd + "&vname=" + vname;
        $.post("http://localhost:8099/login/status",{uid:val,vname:vname},function (data,status) {
            if (!status){
                alert("提交状态error！")
            }
        });
    }
    else{//未登录
        window.location.href="视频.html?vname="+vname;
    }
}
function searchvideo(){
    var objqueryfilm = document.getElementById("queryfilm"); //定位id
    var indexqueryfilm = objqueryfilm.selectedIndex; // 选中索引
    var textqueryfilm = objqueryfilm.options[indexqueryfilm].text; // 选中文本
    var objqueryduration = document.getElementById("queryduration"); //定位id
    var indexqueryduration = objqueryduration.selectedIndex; // 选中索引
    var textqueryduration = objqueryduration.options[indexqueryduration].text; // 选中文本
    var textqueryinput=document.forms["queryinput"]["queryinput2"].value;


    if (val!="default") {//已经登录
        window.location.href="主页.html?uid="+ val+"&uname="+una+"&password="+pwd+"&method="+"search"+"&queryinput="+textqueryinput+"&queryfilm="+textqueryfilm+"&queryduration="+textqueryduration;
    }
    else{//未登录
        window.location.href="主页.html?method="+"search"+"&queryinput="+textqueryinput+"&queryfilm="+textqueryfilm+"&queryduration="+textqueryduration;
    }
}

function recommend(){
    if (val!="default") {//已经登录
        window.location.href="主页.html?uid="+ val+"&uname="+una+"&password="+pwd+"&method="+"recommend";
    }
    else{//未登录
        window.location.href="主页.html?method="+"recommend";
    }
}

function favorite(){
    if (val!="default") {//已经登录
        window.location.href="主页.html?uid="+ val+"&uname="+una+"&password="+pwd+"&method="+"favorite";
        // alert("0000");
    }
    else{//未登录
        alert("请先登录账号！");
        // window.location.href="主页.html?method="+"recommend";
    }
}


// var gotovideo=$(".col-md-3");
// console.log(gotovideo);

    // gotovideo.click(function(){
    //     var vname=$(this).attr("vname");
    //     alert(vname);
    //     $.post("http://localhost:8099/login/status",{uid:val,vname:vname},function (data,status) {
    //         if (!status){
    //             alert("提交状态error！")
    //         }
    //     });
    //     if (typeof(val)!="undefined") {//已经登录
    //         window.location.href = "视频.html?uid=" + val + "&uname=" + una + "&password=" + pwd + "&vname=" + vname;
    //     }
    //     else{//未登录
    //         window.location.href="视频.html?vname="+vname;
    //     }
    // });












// $("#uid").text("用户："+val);


function GetRequest() {
    var url = decodeURI(location.search); //获取url中"?"符后的字串

    var theRequest = new Object();  //Object是所有类型的父类
    if (url.indexOf("?") != -1) { //indexOf返回第一次出现参数字符的位置
        var str = url.substr(1);  //一个参数取相应位置后面的字符串，两个参数则取之间
        strs = str.split("&");   //分割，并返回分割后字符串组成的list，['vid=2','uid=3']
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}