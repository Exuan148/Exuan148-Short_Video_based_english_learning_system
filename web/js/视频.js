//URL传值
var Request = new Object();
Request = GetRequest();
var val= Request["uid"];
var una= Request["uname"];
var vna= Request["vname"];
$(function(){

    var gotopre=$(".quit");
    var LogAndRegistLag=$(".notlog");
    var welcome=$(".logstatus");
    gotopre.click(function(){
        window. location.href="主页.html";
    });


    // alert(vna);
    if (typeof(val)!="undefined") { //已经登录
        LogAndRegistLag.css("display","none");
        welcome.css("display","block");
        welcome.html("Welcome "+una+" !");
        gotopre.css("display","block");
    }
    else{//未登录
        LogAndRegistLag.css("display","block");
        welcome.css("display","none");
        gotopre.css("display","none");
    }
    // 加载视频src
    $("#video1").attr("src", "./video/"+vna+".mp4");
    // $("#video1").attr("src", "E:\\迅雷下载\\video\\"+vna+".mp4");
    //加载字幕
    $.post("http://localhost:8099/subtitle",{vname:vna},function (data,status) {
        if (!status||data[0]['vname']=="not"){
            $(".textlist").append("<li class=\"clearfix2\">\n" +
                "                <div class=\"nt\">\n" +
                "                    <i>1:</i>\n" +
                "                    <img src=\"./images/add_images/nobk.gif\" alt=\"error!\" class=\"note\">\n" +
                "                </div>\n" +
                "                <div class=\"textbox\">\n" +
                "                    <p class=\"en\">Sorry, no subtitle!</p>\n" +
                "                    <p class=\"cn\">无法正常加载字幕！</p>\n" +
                "                </div>\n" +
                "            </li>");
        }
        else{
            var html="";
            for(var i=0;i<data.length;i++){
                html+="<li class=\"clearfix2\" onclick=\"playMedia("+data[i]['starttime'].toString()+",null)\" data-begintime=\""+data[i]['starttime'].toString()+"\" data-endtime=\""+data[i]['endtime'].toString()+"\">\n" +
                    "                <div class=\"nt\">\n" +
                    "                    <i>"+(i+1).toString()+":</i>\n" +
                    "                    <img src=\"./images/add_images/nobk.gif\" alt=\"error!\" class=\"note\">\n" +
                    "                </div>\n" +
                    "                <div class=\"textbox\">\n" +
                    "                    <p class=\"en\">"+data[i]['English'].toString()+"</p>\n" +
                    "                    <p class=\"cn\">"+data[i]['Chinese'].toString()+"</p>\n" +
                    "                </div>\n" +
                    "            </li>";
            }
            $(".textlist").append(html);
        }

    //是否收藏
        var favorite=document.getElementById("favorite");
        if (typeof(val)!="undefined"){//已登录
            $.post("http://localhost:8099/favorite",{uid:val,vname:vna},function(data,status){
                if (!status){
                    favorite.src="./images/add_images/未收藏.png";
                }
                else {
                    if(data[0]['favorite']=="yes") favorite.src="./images/add_images/收藏.png";
                    else favorite.src="./images/add_images/未收藏.png";
                }
            });
        }
        else favorite.src="./images/add_images/未收藏.png";
    });
// 查单词
    $("#searchResultButton").click(function(){
        $("#searchResult").css("display","none");
    });
    $(document).ready(function () {
        $(".textlist").mouseup(function (e) {
            var txt;
            txt = window.getSelection();
            if (txt.toString().length > 1&&txt.toString().length < 15) {
                // console.log(txt.toString());
                $.post("http://localhost:8099/searchword",{word:txt.toString()},function (data,status) {
                    if (status){
                        $("#searchword").html("<p class='word'>" + txt.toString() + "</p>");
                        $("#E_phonogram").html("<div class='phonogram'>" +  "英:"+data["E_pronounce"] + "<img onclick=\"audioplay('E_link')\" onmouseover=\"this.src='./images/add_images/音标声音hover.png'\" onmouseout=\"this.src='./images/add_images/音标声音.png'\" style=\"position: absolute; padding-left:2px;padding-top: 2px\" src='./images/add_images/音标声音.png' alt='error'><audio id='E_link' src='"+data['E_link']+"' preload></audio></div>");
                        $("#A_phonogram").html("<div class='phonogram'>" +  "美:"+data["A_pronounce"] + "<img onclick=\"audioplay('A_link')\" onmouseover=\"this.src='./images/add_images/音标声音hover.png'\" onmouseout=\"this.src='./images/add_images/音标声音.png'\" style=\"position: absolute; padding-left:2px;padding-top: 2px\" src='./images/add_images/音标声音.png' alt='error'><audio id='A_link' src='"+data['A_link']+"' preload></audio></div>");
                        $("#translate").html("<p class='translate'>" +  data["translation"]);
                        $("#searchResult").css("left", e.clientX - 136 + "px");
                        $("#searchResult").css("top", e.clientY+20 + "px");
                        $("#searchResult").css("display", "block");
                    }
                });

            }
        });
    });
});
//音标audio，在wordtest和wordsearch中用到
function audioplay(id){
    var audio=document.getElementById(id);   //audio必须用js原生的方法识别
    audio.play();
    // $(id).play();
}
var wordlist_len;//后面会用到
var tna="";//表名
var wordtest_genre="";//四级词汇、六级词汇，显示在蓝条上面
//这里是单词测试
function wordtest(tablename){
    tna=tablename;//赋值表名：wordtest/wordtest_cet6......
    if(tablename=="wordtest")wordtest_genre="四级词汇";
    else if(tablename=="wordtest_cet6")wordtest_genre="六级词汇";
    else if(tablename=="wordtest_toefl")wordtest_genre="托福词汇";
    else if(tablename=="wordtest_kaoyan")wordtest_genre="考研词汇";
    var newbackground=document.getElementById("newbackground");
    $.post("http://localhost:8099/wordtest",{vname:vna,tname:tna},function(data,status){
        if(!status||data[0]["vname"]=="not"){
            // console.log(data[0]["vname"]);
            alert("本视频没有要学习的单词！");
        }
        else{
            newbackground.style.display="block";
            var wordtest=document.getElementById("mytest");
            wordtest.innerHTML="<div style=\" height: 30px; background-color: #F0F2F3;position:relative\"><img style=\"position: absolute; bottom: 5px; right: 10px;\" src=\"./images/add_images/关闭.png\" alt=\"error\" onclick=\"wordteststop()\"></div>\n" +
                "        <div style=\"width: 100%; height: 50px; background-color: #62A5F7;border-top: 1px solid #1b71c6;border-bottom: 1px solid #1b71c6;position: relative;\"><span style=\"font:28px 新宋体;font-weight: bold;color: white; line-height:50px;margin-left: 30px\">"+wordtest_genre.toString()+"</span></div>\n" +
                "        <div style=\"padding:5px 20px 0 5px; height: 45px; background-color: #F0F2F3; display: block;\" id=\"wordtest_ul_head\">\n" +
                "            <div style=\"width: 100% ;height: 35px; background-color: #F0F2F3 \">\n" +
                "                <div style=\"margin-left: 27px;width:155px; height: 31px; background-color: #F0F2F3;\"><p style=\"font:20px 新宋体; font-weight:bold; color:black; line-height: 31px\">词汇</p>\n" +
                "                    <img id=\"wordtest_icon_word\" src=\"./images/add_images/hide_mouseout.png\" onclick=\"wordtest_hide('word')\"  alt=\"error\" style=\"position: absolute; margin: -25px 0 0 45px;\"></div>\n" +
                "                <div style=\"  width:180px; height:31px; margin-left: 182px;margin-top: -31px; background-color: #F0F2F3\"><p style=\"font:20px 新宋体;font-weight:bold; color:black; line-height: 31px\">音标</p></div>\n" +
                "                <div style=\"  width:329px; height:31px; margin: -31px 0 0 362px; background-color: #F0F2F3\"><p style=\"font:20px 新宋体;font-weight:bold; color:black; line-height: 31px\">释义</p>\n" +
                "                    <img id=\"wordtest_icon_translation\" src=\"./images/add_images/hide_mouseout.png\" onclick=\"wordtest_hide('translation')\"  alt=\"error\" style=\"position: absolute; margin: -25px 0 0 45px;\"></div>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "        <ul style=\"height:365px; overflow-y:scroll; padding:10px 20px 5px ; display: block;\" id=\"wordtest_ul\">\n" +
                "        </ul>";
            wordtest.innerHTML+="<div style=\"width: 100%; height: 45px; background-color: #F0F2F3 ;position: absolute; bottom: 0;\">\n" +
                "            <div id=\"drop-up\" >\n" +
                "                <button class=\"wordtest_btn\" onclick=\"wordtest_btn()\" style=\"width: 100px;height: 40px;position:absolute;bottom: 0\"><p style=\"font:20px 新宋体;\">开始测试</p></button>\n" +
                "                <div class=\"drop-up-div\" onclick=\"wordtest_dictate()\" style=\"display: none ;bottom: 40px;\"><p style=\"font:20px 新宋体; line-height: 25px;text-align: center\">听写电台</p></div>\n" +
                "                <div class=\"drop-up-div\" onclick=\"wordtest_recall()\" style=\"display: none;bottom: 65px;\"><p style=\"font:20px 新宋体; line-height: 25px;text-align: center\">英文回想</p></div>\n" +
                "            </div>\n" +
                "        </div>";
            wordlist_len=data.length;
            var html="";
            for(var i=0;i<data.length;i++){
                // console.log(data[i]["word"]);
                html+="<li style=\"width: 100% ;height: 30px;padding: 4px 0 4px 12px; \">\n" +
                    "                    <div style=\"width:155px; height: 21px;\"><p class='wordtest_word' style='font-weight: bold; ' >"+data[i]["word"].toString()+"</p></div>\n" +
                    "                    <div style=\"width:180px; height:21px; margin-left: 155px;margin-top: -21px;font-weight: bold\">"+data[i]["phonetic"].toString()+"<img onclick=\"audioplay('wordtest_voice"+i.toString()+"\')\" onmouseover=\"this.src='./images/add_images/音标声音hover.png'\" onmouseout=\"this.src='./images/add_images/音标声音.png'\" style=\"position: relative; padding-left:2px;padding-top: 2px\" src='./images/add_images/音标声音.png' alt='error'><audio id='wordtest_voice"+i.toString()+"\' src='http://dict.youdao.com/dictvoice?type=1&audio="+data[i]["word"].toString()+"/' preload></audio></div>\n" +
                    "                    <div style=\"width:329px; height:21px; margin: -21px 0 0 335px;\"><p class='wordtest_translation' style='font-weight: bold'>"+data[i]["translation"].toString()+"</p></div>\n" +
                    "            </li>"
            }
            $("#wordtest_ul").append(html);
            //显示窗口
            wordtest.style.display="block";
        }
    });
}
//隐藏标签，在wordtest中用到
function wordtest_hide(genre) {

    if (genre=="word"){
        var element=document.getElementById("wordtest_icon_word");
        if (element.src.match("hide")){//此处不能直接判断图片的地址，因为不是本地地址
            element.src="./images/add_images/show_mouseout.png";
            $(".wordtest_word").each(function () {
                $(this).css("display","none");
            });
        }
        else{
            element.src="./images/add_images/hide_mouseout.png";
            $(".wordtest_word").each(function () {
                $(this).css("display","block");
            });
        }
    }
    if (genre=="translation") {
        var element=document.getElementById("wordtest_icon_translation");
        if (element.src.match("hide")){//此处不能直接判断图片的地址，因为不是本地地址
            element.src="./images/add_images/show_mouseout.png";
            $(".wordtest_translation").each(function () {
                $(this).css("display","none");
            });
        }
        else{
            element.src="./images/add_images/hide_mouseout.png";
            $(".wordtest_translation").each(function () {
                $(this).css("display","block");
            });
        }
}
    }

function wordteststop(){
    var wordteststop=document.getElementById("mytest");
    wordteststop.style.display="none";
    var newbackground=document.getElementById("newbackground");
    newbackground.style.display="none";
}
//上拉菜单
function wordtest_btn() {
    var drop_up_div=document.getElementsByClassName("drop-up-div");
    var i=0;
    if (drop_up_div[0].style.display=="none"){
        for( i=0;i<drop_up_div.length;i++){
            drop_up_div[i].style.display="block";
        }
    }
    else{
        for( i=0;i<drop_up_div.length;i++){
            drop_up_div[i].style.display="none";
        }
    }
}
var singleword="";
//单词回想
var word_wrong_recall=0;//单词回想中答错的数目
function wordtest_recall() {
    word_wrong_recall=0;
    var wordtest=document.getElementById("mytest");
    wordtest.innerHTML="<div style=\" height: 30px; background-color: #F0F2F3;position:relative\"><img style=\"position: absolute; bottom: 5px; right: 10px;\" src=\"./images/add_images/关闭.png\" alt=\"error\" onclick=\"wordteststop()\"></div>\n" +
        "        <div style=\"width: 100%; height: 50px; background-color: #62A5F7;border-top: 1px solid #1b71c6;border-bottom: 1px solid #1b71c6;position: relative;\"><span style=\"font:28px 新宋体;font-weight: bold;color: white; line-height:50px;margin-left: 30px\">"+wordtest_genre.toString()+"</span></div>\n";
    wordtest.innerHTML+="<div id=\"wordtest_recall\" style=\"background-color: lightgrey; margin: 40px 0 0 45px; border-radius:50px; border: black 2px solid; display:block ;width:650px ; height:350px\">\n" +
        "        </div>\n" +
        "        <div style=\"width: 100%; height: 45px; background-color: #F0F2F3 ;position: absolute; bottom: 0;\">\n" +
        "            <div id=\"drop-up\" >\n" +
        "                <button class=\"wordtest_btn\" onclick=\"wordtest(tna)\" style=\"width: 100px;height: 40px;position:absolute;bottom: 0\"><p style=\"font:20px 新宋体;\">单词列表</p></button>\n"+
        "            </div>\n" +
        "        </div>";
    //加载第一个单词
    wordtest_load_recall(0);
}

//听写电台
var word_wrong_dictation=0;//听写电台中答错的数目
function wordtest_dictate() {
    word_wrong_dictation=0;
    var wordtest=document.getElementById("mytest");
    wordtest.innerHTML="<div style=\" height: 30px; background-color: #F0F2F3;position:relative\"><img style=\"position: absolute; bottom: 5px; right: 10px;\" src=\"./images/add_images/关闭.png\" alt=\"error\" onclick=\"wordteststop()\"></div>\n" +
        "        <div style=\"width: 100%; height: 50px; background-color: #62A5F7;border-top: 1px solid #1b71c6;border-bottom: 1px solid #1b71c6;position: relative;\"><span style=\"font:28px 新宋体;font-weight: bold;color: white; line-height:50px;margin-left: 30px\">"+wordtest_genre.toString()+"</span></div>\n";
    wordtest.innerHTML+="<div id=\"wordtest_dictation\" style=\"background-color: lightgrey; margin: 40px 0 0 45px; border-radius:50px; border: black 2px solid; display:block ;width:650px ; height:350px\">\n" +
        "        </div>\n" +
        "        <div style=\"width: 100%; height: 45px; background-color: #F0F2F3 ;position: absolute; bottom: 0;\">\n" +
        "            <div id=\"drop-up\" >\n" +
        "                <button class=\"wordtest_btn\" onclick=\"wordtest(tna)\" style=\"width: 100px;height: 40px;position:absolute;bottom: 0\"><p style=\"font:20px 新宋体;\">单词列表</p></button>\n"+
        "            </div>\n" +
        "        </div>";
    //加载第一个单词
    wordtest_load_dictation(0);
}

//单词回想提交,第一步加载第0个单词的发音，然后提交第0个单词并加载第一个单词，直到最后一个
function wordtest_submit_recall(number){
    //这里的number是字符串
    var wordtest_recall_submit=document.getElementById("wordtest_recall_submit");
    var recall_word=document.forms["wordtest_recall"]["wordtest_text"+number.toString()].value;
    if (wordtest_recall_submit.value=="结束") {
        var wordtest_recall=document.getElementById("wordtest_recall");
        //星级打分
        var star_recall_num=parseInt((wordlist_len-word_wrong_recall)/wordlist_len*5);
        wordtest_recall.innerHTML="<div style=\"position: relative;margin-top:90px;height: 80px;\"><img id=\"wordtest_recall_stars\" style=\"position: absolute; margin-top:20px;margin-left: 140px;\" src=\"./images/add_images/星级"+star_recall_num.toString()+".png\" alt=\"error\"></div>\n" +
            "            <div style=\"position: relative;margin-top:40px;height: 40px;\"><p style=\"position:absolute; left: 220px;font:20px 新宋体; line-height: 40px\">答对"+(wordlist_len-word_wrong_recall).toString()+"题，正确率"+(((wordlist_len-word_wrong_recall)/wordlist_len)*100).toFixed(2)+"%</p></div>\n" +
            "            <div style=\"position: relative;margin-top:0 ;height: 40px;\"><p style=\"position:absolute; left: 220px;color: blue;font:15px 新宋体; line-height: 40px\">点击左下角返回单词列表</p></div>";
        //修改左下角的按钮为‘返回单词列表’
        var drop_up=document.getElementById("drop-up");
        drop_up.innerHTML="<button class=\"wordtest_btn\" onclick=\"wordtest('"+tna.toString()+"')\" style=\"width: 100px;height: 40px;position:absolute;bottom: 0\"><p style=\"font:20px 新宋体;\">单词列表</p></button>";
    }
    else if (recall_word==singleword||wordtest_recall_submit.value=="下一题"){

        if (parseInt(number)+1==wordlist_len){
            wordtest_recall_submit.value="结束"
        }
        else{
            wordtest_load_recall(parseInt(number)+1);
        }
    }
    else{
        //答错数加1
        word_wrong_recall+=1;
        //显示叉号图标
        var wordtest_recall_false=document.getElementById("wordtest_recall_false");
        wordtest_recall_false.style.display="block";
        //显示单词
        var wordtest_recall_word=document.getElementById("wordtest_recall_word");
        wordtest_recall_word.style.display="block";
        //显示音标
        var wordtest_recall_phonetic=document.getElementById("wordtest_recall_phonetic");
        wordtest_recall_phonetic.style.display="block";
        //显示释义
        // var wordtest_dictation_translation=document.getElementById("wordtest_dictation_translation");
        // wordtest_dictation_translation.style.display="block";
        //修改按钮
        wordtest_recall_submit.value="下一题";

    }
}

//听写电台提交,第一步加载第0个单词的发音，然后提交第0个单词并加载第一个单词，直到最后一个
function wordtest_submit_dictation(number){
    // alert(number);
    //这里的number是字符串
    var wordtest_dictation_submit=document.getElementById("wordtest_dictation_submit");
    var dictation_word=document.forms["wordtest_dictation"]["wordtest_text"+number.toString()].value;
    if (wordtest_dictation_submit.value=="结束") {
        // alert("结束了");
        var wordtest_dictation=document.getElementById("wordtest_dictation");
        //星级打分
        var star_dictation_num=parseInt((wordlist_len-word_wrong_dictation)/wordlist_len*5);
        wordtest_dictation.innerHTML="<div style=\"position: relative;margin-top:90px;height: 80px;\"><img id=\"wordtest_dictation_stars\" style=\"position: absolute; margin-top:20px;margin-left: 140px;\" src=\"./images/add_images/星级"+star_dictation_num.toString()+".png\" alt=\"error\"></div>\n" +
            "            <div style=\"position: relative;margin-top:40px;height: 40px;\"><p style=\"position:absolute; left: 220px;font:20px 新宋体; line-height: 40px\">答对"+(wordlist_len-word_wrong_dictation).toString()+"题，正确率"+(((wordlist_len-word_wrong_dictation)/wordlist_len)*100).toFixed(2)+"%</p></div>\n" +
            "            <div style=\"position: relative;margin-top:0 ;height: 40px;\"><p style=\"position:absolute; left: 220px;color: blue;font:15px 新宋体; line-height: 40px\">点击左下角返回单词列表</p></div>";
        //修改左下角的按钮为‘返回单词列表’
        var drop_up=document.getElementById("drop-up");
        drop_up.innerHTML="<button class=\"wordtest_btn\" onclick=\"wordtest('"+tna.toString()+"')\" style=\"width: 100px;height: 40px;position:absolute;bottom: 0\"><p style=\"font:20px 新宋体;\">单词列表</p></button>";
    }
    else if (dictation_word==singleword||wordtest_dictation_submit.value=="下一题"){
        // alert("yes");
        if (parseInt(number)+1==wordlist_len){
            wordtest_dictation_submit.value="结束"
        }
        else{
            wordtest_load_dictation(parseInt(number)+1);
        }

    }
    else{
        //答错数加1
        word_wrong_dictation+=1;
        //显示音标
        var wordtest_dictation_phonetic=document.getElementById("wordtest_dictation_phonetic");
        wordtest_dictation_phonetic.style.display="block";
        //显示叉号图标
        var wordtest_dictation_false=document.getElementById("wordtest_dictation_false");
        wordtest_dictation_false.style.display="block";
        //显示单词
        var wordtest_dictation_word=document.getElementById("wordtest_dictation_word");
        wordtest_dictation_word.style.display="block";
        //显示释义
        var wordtest_dictation_translation=document.getElementById("wordtest_dictation_translation");
        wordtest_dictation_translation.style.display="block";
        //修改按钮
        wordtest_dictation_submit.value="下一题";

    }
}
//加载单词回想的页面，发送post请求
function wordtest_load_recall(number){
    //这里的number是整型
    $.post("http://localhost:8099/wordtest",{vname:vna,tname:tna},function(data,status){
        if(!status||data[0]["vname"]=="not"){
            alert("本视频没有要学习的单词！");
        }
        else{
            singleword=data[number]["word"];//singleword是预先赋值的单词，用来和后面提交的单词比对
            var wordtest_recall=document.getElementById("wordtest_recall");
            wordtest_recall.innerHTML="            <div style=\"position: relative;margin-top:50px;height: 40px;\">\n" +
                "                <p style=\"font:20px 新宋体; line-height: 40px\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;释义：</p>\n" +
                "                <p id=\"wordtest_recall_translation\" style=\" display: block;font:20px 新宋体;position: absolute; bottom:9px; left:220px\">"+data[number]["translation"].toString()+"</p>\n" +
                "            </div>\n" +
                "            <form name=\"wordtest_recall\" style=\"margin-top:10px;height: 40px; position: relative;\">\n" +
                "                <p style=\"font:20px 新宋体; line-height: 40px\">&nbsp;&nbsp;输入你想到的单词：</p>\n" +
                "                <input name=\""+"wordtest_text"+number.toString()+"\" type=\"text\" style=\"height: 25px;border-style:none;border-bottom: 1px solid black;font-weight: bold;font-size: 18px;background-color: lightgrey;color: #666666; position: absolute; bottom: 5px; left:220px;\">\n" +
                "                <img id='wordtest_recall_false' src=\"./images/add_images/叉号.png\" alt=\"error\" style=\" display: none;position: absolute;bottom:7px; left:440px\">\n" +
                "                <input id='wordtest_recall_submit' name='submit' onclick=\"wordtest_submit_recall('"+number.toString()+"')\" type=\"button\" value=\"提交\" class=\"wordtest_btn\" style=\"width: 60px;height: 30px;position:absolute;bottom: 6px; left: 470px;\">\n" +
                "\n" +
                "            </form>\n" +
                "            <div style=\"position: relative;margin-top:10px;height: 40px;\">\n" +
                "                <p id='wordtest_recall_word' style=\"display: none;font-size: 18px;font-weight: bold; color: blue;line-height: 40px ;position:absolute;left: 220px;\">"+data[number]["word"].toString()+"</p>\n" +
                "            </div>\n" +
                "            <div style=\"position: relative;margin-top:10px;height: 40px;\">\n" +
                "                <p id='wordtest_recall_phonetic' style=\"display: none;font-size: 18px;font-weight: bold; color: blue;line-height: 40px ;position:absolute;left: 220px;\">"+data[number]["phonetic"].toString()+"</p>\n" +
                "            </div>\n"+
                "            <div style='position: relative;margin-top:60px;height: 40px;'><p style='position: absolute; bottom: 0; left: 300px;font: 15px; color: black;'>"+(number+1).toString()+"&nbsp/&nbsp"+ wordlist_len.toString()+"</p></div>";
        }
    });

}
//加载听写电台的页面，发送post请求
function wordtest_load_dictation(number){
    //这里的number是整形
    $.post("http://localhost:8099/wordtest",{vname:vna,tname:tna},function(data,status){
        if(!status||data[0]["vname"]=="not"){
            // console.log(data[0]["vname"]);
            alert("本视频没有要学习的单词！");
        }
        else{
            singleword=data[number]["word"];
            var wordtest_dictation=document.getElementById("wordtest_dictation");
            wordtest_dictation.innerHTML="            <div style=\"position: relative;margin-top:50px;height: 40px;\">\n" +
                "                <p style=\"font:20px 新宋体; line-height: 40px\">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;发音：</p>\n" +
                "                <img onclick=\"audioplay('wordtest_dictation_audio')\" style=\"position: absolute; bottom:7px; left:220px\" src=\"./images/add_images/喇叭wordtest_dictation_mouseout.png\" alt=\"error\" onmouseover=\"this.src='./images/add_images/喇叭wordtest_dictation_mouseover.png'\" onmouseout=\"this.src='./images/add_images/喇叭wordtest_dictation_mouseout.png'\">\n" +
                "                <audio id='wordtest_dictation_audio' src='http://dict.youdao.com/dictvoice?type=1&audio="+data[number]["word"].toString()+"' preload></audio>\n" +
                "                <p id=\"wordtest_dictation_phonetic\" style=\" display: none;font:20px 新宋体;position: absolute; bottom:7px; left:250px\">"+data[number]["phonetic"].toString()+"</p>\n" +
                "            </div>\n" +
                "            <form name=\"wordtest_dictation\" style=\"margin-top:10px;height: 40px; position: relative;\">\n" +
                "                <p style=\"font:20px 新宋体; line-height: 40px\">&nbsp;&nbsp;输入你听到的单词：</p>\n" +
                "                <input name=\""+"wordtest_text"+number.toString()+"\" type=\"text\" style=\"height: 25px;border-style:none;border-bottom: 1px solid black;font-weight: bold;font-size: 18px;background-color: lightgrey;color: #666666; position: absolute; bottom: 5px; left:220px;\">\n" +
                "                <img id='wordtest_dictation_false' src=\"./images/add_images/叉号.png\" alt=\"error\" style=\" display: none;position: absolute;bottom:7px; left:440px\">\n" +
                "                <input id='wordtest_dictation_submit' name='submit' onclick=\"wordtest_submit_dictation('"+number.toString()+"')\" type=\"button\" value=\"提交\" class=\"wordtest_btn\" style=\"width: 60px;height: 30px;position:absolute;bottom: 6px; left: 470px;\">\n" +
                "\n" +
                "            </form>\n" +
                "            <div style=\"position: relative;margin-top:10px;height: 40px;\">\n" +
                "                <p id='wordtest_dictation_word' style=\"display: none;font-size: 18px;font-weight: bold; color: blue;line-height: 40px ;position:absolute;left: 220px;\">"+data[number]["word"].toString()+"</p>\n" +
                "            </div>\n" +
                "            <div style=\"position: relative;margin-top:10px;height: 40px;\">\n" +
                "                <p id='wordtest_dictation_translation' style=\"display: none;font-size: 18px;font-weight: bold; color: blue;line-height: 40px ;position:absolute;left: 220px;\">"+data[number]["translation"].toString()+"</p>\n" +
                "            </div>\n"+
                "            <div style='position: relative;margin-top:60px;height: 40px;'><p style='position: absolute; bottom: 0; left: 300px;font: 15px; color: black;'>"+(number+1).toString()+"&nbsp/&nbsp"+ wordlist_len.toString()+"</p></div>";
        }
    });

}
function addfavorite(){
    var favorite=document.getElementById("favorite");
    if (typeof(val)!="undefined"){//已登录
        if(favorite.src.match("未收藏")){
            $.post("http://localhost:8099/favorite/add",{uid:val,vname:vna},function(data,status){
                if (!status){
                    // alert("未收藏成功！")
                }
                else {
                    if(data[0]['favorite_add']=="yes") favorite.src="./images/add_images/收藏.png";
                    else alert("未收藏成功!")
                }
            });
        }
        else{
            $.post("http://localhost:8099/favorite/del",{uid:val,vname:vna},function(data,status){
                if (!status){
                    // alert("未取消收藏成功！")
                }
                else {
                    if(data[0]['favorite_del']=="yes") favorite.src="./images/add_images/未收藏.png";
                    else alert("未取消收藏成功!")
                }
            });
        }
    }
    else {
        alert("请先登录账号！")
    }

}
//URL传值解析函数
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

