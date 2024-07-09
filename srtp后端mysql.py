#-*- codeing = utf-8 -*-
#@Time : 2021/1/11 15:25
#@File : srtp后端mysql.py
#@Software: PyCharm
import pymysql
from flask import Flask, request, jsonify
from flask_cors import CORS
# db=pymysql.connect(host="localhost",user="root",passwd='123456',db='mysrtp')
# cursor=db.cursor()
import nltk
import random
w=open("D:\\Users\\hp\\PycharmProjects\\20208月课\\srtp\\Kmeans\\data\\字幕\\daopaibiao.txt","r",encoding="utf-8")
daopaibiao=eval(w.read())
print(daopaibiao)
w.close()
#后端服务器启动
app=Flask(__name__)
#这一行解决跨域问题
CORS(app,resources=r'/*')

@app.route('/regist/add',methods=['POST'])
def regist_add():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method=='POST':
        #接受前端的表单发过来的参数，前一个是python中自定义的名字，后一个username是前端提供的名字,注：form无法获得请求，也可以用values
        uname=request.values.get("uname",type=str,default=None)
        password=request.values.get("password",type=str,default=None)
        try:
            cursor.execute("insert into regist(uname,password) values(\""+str(uname)+"\",\""+str(password)+"\")")
            db.commit()
            print(uname)
            print(password)
            print("add a new user successfully:")
            #如果直接返回int 1 会报错
            cursor.close()
            db.close()
            return "1"
        except Exception as e:
            print("add a new user failed:",e)
            cursor.close()
            db.rollback()
            db.close()
            return "-1"

@app.route('/login/vertify',methods=['post'])
def login_vertify():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method=='POST':
        uname=request.values.get("uname",type=str,default=None)
        password=request.values.get("password",type=str,default=None)
        cursor.execute("SELECT uid,uname  FROM regist where uname=\""+str(uname)+"\" and password=\""+str(password)+"\"")
        data = cursor.fetchall()
        temp = {}
        result = []
        for i in data:
            temp["uid"] = i[0]
            temp["uname"] = i[1]
            result.append(temp.copy())
        if (len(result)==0):
            print("找不到用户")
            temp["uid"] = 'not'
            temp["uname"] = 'not'
            result.append(temp.copy())
        else:
            print("找到用户")
        cursor.close()
        db.close()
        return jsonify(result)

@app.route('/login/status',methods=['POST'])
def login_status():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method=='POST':
        uid=request.values.get("uid",type=str,default=None)
        vname=request.values.get("vname",type=str,default=None)
        print(uid,vname)
        try:
            cursor.execute("INSERT INTO loginstatus ( uid, vname )\n" +
"VALUES\n" +
"	( "+uid+", \""+vname+"\" )")
            db.commit()
            print(uid)
            print(vname)
            print("add a new status successfully:")
            #如果直接返回int 1 会报错
            cursor.close()
            db.close()
            return "1"
        except Exception as e:
            print("add a new status failed:",e)
            cursor.close()
            db.rollback()
            db.close()
            return "-1"

@app.route('/subtitle',methods=['post'])
def subtitle():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method=='POST':
        vname=request.values.get("vname",type=str,default=None)
        try:
            cursor.execute(
                "SELECT vname,num,starttime,endtime,Chinese,English  FROM subtitle where vname=\"" + str(vname) + "\"")
            data = cursor.fetchall()
            # print(data)
            temp = {}
            result = []
            for i in data:
                temp["vname"] = i[0]
                temp["num"] = i[1]
                temp["starttime"] = i[2]
                temp["endtime"] = i[3]
                temp["Chinese"] = i[4]
                temp["English"] = i[5]
                result.append(temp.copy())
            if (len(result) == 0):
                print("找不到字幕")
                temp["vname"] = "not"
                result.append(temp.copy())
            else:
                print("找到字幕")
            cursor.close()
            db.close()
            return jsonify(result)
        except:
            print("字幕error!")
            cursor.close()
            db.close()
            return jsonify([{"vname": "not"}])




@app.route('/searchword',methods=['post'])
def searchword():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    import requests
    from bs4 import BeautifulSoup
    import re
    if request.method=='POST':
        word=request.values.get("word",type=str,default=None)
        dicts = {"category": "phrase", "E_pronounce": "", "E_link": "", "A_pronounce": "", "A_link": "",
                 "translation": ""}
        try:
            spider_urls = ["http://dict.cn/" + word]
            for spider_url in spider_urls:
                response = requests.get(spider_url)
                response = response.content.decode('utf-8')
                soup = BeautifulSoup(response, "html.parser")  # html5lib
                div_pronounce = soup.find('div', class_='phonetic')
                ul_translate = soup.find('div', class_='basic clearfix')
                findPronounce = re.compile(r'<bdo lang="EN-US">(.*)</bdo>')
                findTranslateType = re.compile(r'<span>(.*)</span>')
                findTranslate = re.compile(r'<strong>(.*)</strong>')
                i = 0;
                for cate1 in div_pronounce.find_all("span"):
                    cate1 = str(cate1)
                    # 作类型转换,转为str
                    pronounce = re.findall(findPronounce, cate1)[0]
                    if i == 0:
                        dicts["E_pronounce"] = pronounce
                        dicts["E_link"] = "http://dict.youdao.com/dictvoice?type=1&audio=" + word

                    elif i == 1:
                        dicts["A_pronounce"] = pronounce
                        dicts["A_link"] = "http://dict.youdao.com/dictvoice?type=0&audio=" + word
                    i += 1
                # 得到释义
                for cate2 in ul_translate.find_all("li", {"style": ""}):
                    if cate2.find("span"):
                        dicts["category"] = "singleword"
                        # 先不转化为str，在该HTML文本中，若有子标签span则加入到列表
                        cate2 = str(cate2)
                        translatetype = re.findall(findTranslateType, cate2)[0]
                        dicts["translation"] += translatetype
                    cate2 = str(cate2)
                    translate = re.findall(findTranslate, cate2)[0]
                    dicts["translation"] += translate + "。"
                    print("Get translation successfully!")
        except Exception as e:
            print("Get translation failed!",e)
        result=dicts
        cursor.close()
        db.close()
        return jsonify(result)

@app.route('/wordtest',methods=['post'])
def wordtest():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method=='POST':
        vname=request.values.get("vname",type=str,default=None)
        tname=request.values.get("tname",type=str,default=None)
        print(vname,tname)
        try:
            cursor.execute("SELECT\n" +
                           "	vname,\n" +
                           "	word,\n" +
                           "	phonetic,\n" +
                           "	translation,\n" +
                           "	Chinese,\n" +
                           "	English \n" +
                           "FROM\n" +
                           "	`"+str(tname)+"` \n" +
                           "WHERE\n" +
                           "	vname = \"" + str(vname) + "\"")
            data = cursor.fetchall()
            # print(data)
            temp = {}
            result = []
            for i in data:
                temp["vname"] = i[0]
                temp["word"] = i[1]
                temp["phonetic"] = i[2]
                temp["translation"] = i[3]
                temp["Chinese"] = i[4]
                temp["English"] = i[5]
                result.append(temp.copy())
            if (len(result) == 0):
                print("找不到单词，或没有单词")
                temp["vname"] = "not"
                result.append(temp.copy())
            else:
                print("找到单词")
            cursor.close()
            db.close()
            return jsonify(result)
        except:
            print("Wordtest error!")
            cursor.close()
            db.close()
            return jsonify([{"vname":"not"}])

@app.route('/videolist',methods=['post'])
def videolist():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method=='POST':
        method=request.values.get("method",type=str,default=None)
        uid=request.values.get("uid",type=str,default=None)
        uname=request.values.get("uname",type=str,default=None)
        password=request.values.get("password",type=str,default=None)
        queryfilm=request.values.get("queryfilm",type=str,default=None)
        queryinput=request.values.get("queryinput",type=str,default=None)
        queryduration=request.values.get("queryduration",type=str,default=None)
        print(method,uid,uname,password,queryinput,queryfilm,queryduration)
        if(method=="search"):
            if (queryfilm == "任意"):
                queryfilm = ""
            if (queryduration == "任意"):
                querydurationlow = 0
                querydurationhigh = 999
            elif (queryduration == "5min+"):
                querydurationlow = 5
                querydurationhigh = 999
            else:
                querydurationlow = int(queryduration.replace("min+", ""))
                querydurationhigh = querydurationlow + 1

            try:
                data = []
                if(queryinput==""):
                    videolist=[""]
                else:
                    queryinput = queryinput.lower().replace('.', '').replace('-', '').replace('?', '').replace(',', '')
                    words = nltk.word_tokenize(queryinput)
                    videolist = []
                    for word in words:
                        try:
                            vnames = daopaibiao[word]
                            for vname in vnames:
                                if(vname not in videolist):
                                    videolist.append(vname)
                        except:
                            pass
                print(videolist)
                print(queryfilm)
                print(querydurationlow)
                print(querydurationhigh)

                for i in range(len(videolist)):

                    cursor.execute("SELECT\n" +
                                   "	* \n" +
                                   "FROM\n" +
                                   "	`videolist` \n" +
                                   "WHERE\n" +
                                   "	vname LIKE \"%" + videolist[i] + "\" \n" +
                                   "	AND vname LIKE \"%" + queryfilm + "%\" \n" +
                                   "	AND duration >=" + str(querydurationlow) + " \n" +
                                   "	AND duration <" + str(querydurationhigh)
                                   )

                    if(queryinput==""):
                        data=cursor.fetchall()
                    else:
                        datasingle = cursor.fetchall()
                        if(len(datasingle)!=0): data.append(datasingle[0])
                temp = {}
                result = []
                count=0
                for i in data:
                    if(count>=50):break#最多加载50个视频
                    temp["vname"] = i[0]
                    temp["firstsentence"] = i[1]
                    temp["duration"] = str(i[2]) + "min"
                    temp["vtitle"] = i[3]
                    result.append(temp.copy())
                    count += 1
                if (len(result) == 0):
                    print("找不到视频列表")
                    temp["vname"] = "not"
                    result.append(temp.copy())
                else:
                    print("找到视频列表")
                cursor.close()
                db.close()
                return jsonify(result)
            except:
                print("Videolist error!")
            cursor.close()
            db.close()
            return jsonify([{"vname": 'not'}])

        if(method=="recommend"):
            recommendlist=[]
            result = []
            if(uid!="default"):
                data=[]
                dataclicked=[]
                dataclickedword=[]
                try:
                    cursor.execute("SELECT\n" +
                                   "	* \n" +
                                   "FROM\n" +
                                   "	(\n" +
                                   "SELECT\n" +
                                   "	v.vname,\n" +
                                   "	v.theme0,\n" +
                                   "	v.theme1,\n" +
                                   "	v.theme2,\n" +
                                   "	v.theme3,\n" +
                                   "	v.theme4,\n" +
                                   "	v.theme5,\n" +
                                   "	v.theme6 \n" +
                                   "FROM\n" +
                                   "	videolist v,\n" +
                                   "	loginstatus l \n" +
                                   "WHERE\n" +
                                   "	v.vname = l.vname \n" +
                                   "	AND l.uid = "+str(uid)+" \n" +
                                   "ORDER BY\n" +
                                   "	l.statustime DESC \n" +
                                   "	) AS w \n" +
                                   "	LIMIT 20")
                    data = cursor.fetchall()
                    for item in data:
                        if(item[0] not in dataclicked):
                            dataclicked.append(item[0])
                        for i in range(1,7):
                            if(item[i] not in dataclickedword):
                                dataclickedword.append(item[i])
                    print(dataclickedword)
                    print(dataclicked)
                    for word in dataclickedword:
                        try:
                            for vname in daopaibiao[word]:
                                if(vname not in recommendlist and vname not in dataclicked):
                                    recommendlist.append(vname)
                        except:
                            pass
                except:
                    print("寻找用户轨迹时出错")
            print(recommendlist)

            if(len(recommendlist)>50):
                for i in range(len(recommendlist)-50):
                    del recommendlist[random.randint(0,50)]

            if(len(recommendlist)>0):
                try:
                    for recommendvname in recommendlist:
                        cursor.execute("SELECT\n" +
                                       "	* \n" +
                                       "FROM\n" +
                                       "	videolist \n" +
                                       "WHERE\n" +
                                       "	vname = \"" + str(recommendvname) + "\"")
                        data = cursor.fetchall()
                        temp = {}

                        for i in data:
                            temp["vname"] = i[0]
                            temp["firstsentence"] = i[1]
                            temp["duration"] = str(i[2]) + "min"
                            temp["vtitle"] = i[3]
                            result.append(temp.copy())
                except:
                    print("获取推荐视频时出错")
            else:
                print("无新推荐的视频")

            execstr=""
            if(len(recommendlist)==50):
                cursor.close()
                db.close()
                return jsonify(result)
            elif(len(recommendlist)>0):#小于50个视频大于0
                execstr="SELECT\n" +"	* \n" +"FROM\n" +"	videolist \n" +"WHERE\n"
                for index in range(len(recommendlist)):
                    if(index==0):execstr+="	vname != \""+str(recommendlist[index])+"\" \n"
                    else:execstr+="and vname != \""+str(recommendlist[index])+"\" \n"
                execstr+="ORDER BY\n" +"	rand( ) \n" +"	LIMIT "+str(50-len(recommendlist))
            else:
                execstr="SELECT\n" +"	* \n" +"FROM\n" +"	videolist \n" +"ORDER BY\n" +"	rand( ) \n" +"	LIMIT 50"
            try:
                # print(execstr)
                cursor.execute(execstr)
                data=cursor.fetchall()
                print(data)
                temp = {}
                for i in data:
                    temp["vname"] = i[0]
                    temp["firstsentence"] = i[1]
                    temp["duration"] = str(i[2]) + "min"
                    temp["vtitle"] =  i[3]
                    result.append(temp.copy())
                if (len(result) == 0):
                    print("找不到视频列表")
                    temp["vname"] = "not"
                    result.append(temp.copy())
                else:
                    print("找到视频列表")
                    cursor.close()
                    db.close()
                    return jsonify(result)
            except:
                print("获取随机视频时出错")
                cursor.close()
                db.close()
                return jsonify([{"vname": 'not'}])
        if(method=="favorite"):
            try:
                cursor.execute("SELECT\n" +
"	* \n" +
"FROM\n" +
"	videolist \n" +
"WHERE\n" +
"	vname IN ( SELECT vname FROM `favoritestatus` WHERE uid = "+str(uid)+" ORDER BY statustime DESC ) \n" +
"	LIMIT 50")
                data = cursor.fetchall()
                print(data)
                temp = {}
                result = []
                for i in data:
                    temp["vname"] = i[0]
                    temp["firstsentence"] = i[1]
                    temp["duration"] = str(i[2]) + "min"
                    temp["vtitle"] =  i[3]
                    result.append(temp.copy())
                if (len(result) == 0):
                    print("找不到视频列表")
                    temp["vname"] = "not"
                    result.append(temp.copy())
                else:
                    print("找到视频列表")
                    cursor.close()
                    db.close()
                    return jsonify(result)
            except:
                print("Videolist error!")
                cursor.close()
                db.close()
                return jsonify([{"vname": 'not'}])





#             try:
#                 cursor.execute("SELECT\n" +
# "	* \n" +
# "FROM\n" +
# "	videolist \n" +
# "ORDER BY\n" +
# "	rand( ) \n" +
# "	LIMIT 20")
#                 data = cursor.fetchall()
#                 print(data)
#                 temp = {}
#                 result = []
#                 for i in data:
#                     temp["vname"] = i[0]
#                     temp["firstsentence"] = i[1]
#                     temp["duration"] = str(i[2]) + "min"
#                     temp["vtitle"] = i[0] + "_" + i[3]
#                     result.append(temp.copy())
#                 if (len(result) == 0):
#                     print("找不到视频列表")
#                     temp["vname"] = "not"
#                     result.append(temp.copy())
#                 else:
#                     print("找到视频列表")
#                 cursor.close()
#                 db.close()
#                 return jsonify(result)
#             except:
#                 print("Videolist error!")
#                 cursor.close()
#                 db.close()
#                 return jsonify([{"vname": 'not'}])


@app.route('/favorite',methods=['post'])
def favorite():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method == 'POST':
        uid = request.values.get("uid", type=str, default=None)
        vname = request.values.get("vname", type=str, default=None)
        print(uid,vname)
        try:
            cursor.execute("SELECT\n" +
                           "	* \n" +
                           "FROM\n" +
                           "	`favoritestatus` \n" +
                           "WHERE\n" +
                           "	uid = " + str(uid) + " \n" +
                           "	AND vname = \"" + str(vname) + "\"")
            data=cursor.fetchall()
            print(data)
            if(len(data)==0):
                cursor.close()
                db.close()
                print("not")
                return jsonify([{"favorite": 'not'}])
            else:
                cursor.close()
                db.close()
                print("yes")
                return jsonify([{"favorite": 'yes'}])

        except:
            print("favorite error!")
            cursor.close()
            db.close()
            return jsonify([{"favorite": 'not'}])

@app.route('/favorite/add',methods=['post'])
def favorite_add():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method == 'POST':
        uid = request.values.get("uid", type=str, default=None)
        vname = request.values.get("vname", type=str, default=None)
        print(uid, vname)
        try:
            cursor.execute("INSERT INTO `favoritestatus` ( uid, vname )\n" +
"VALUES\n" +
"	( "+str(uid)+", \""+str(vname)+"\" )")
            db.commit()
            print("favorite_add successfully!")
            cursor.close()
            db.close()
            return jsonify([{"favorite_add": 'yes'}])
        except:
            print("favorite_add error!")
            cursor.close()
            db.rollback()
            db.close()
            return jsonify([{"favorite_add": 'not'}])

@app.route('/favorite/del',methods=['post'])
def favorite_del():
    db = pymysql.connect(host="localhost", user="root", passwd='123456', db='mysrtp')
    cursor = db.cursor()
    if request.method == 'POST':
        uid = request.values.get("uid", type=str, default=None)
        vname = request.values.get("vname", type=str, default=None)
        print(uid, vname)
        try:
            cursor.execute("DELETE \n" +
"FROM\n" +
"	`favoritestatus` \n" +
"WHERE\n" +
"	uid = "+str(uid)+" \n" +
"	AND vname = \""+str(vname)+"\"")
            db.commit()
            print("favorite_del successfully!")
            cursor.close()
            db.close()
            return jsonify([{"favorite_del": 'yes'}])
        except:
            print("favorite_del error!")
            cursor.close()
            db.rollback()
            db.close()
            return jsonify([{"favorite_del": 'not'}])
if __name__=="__main__":

    app.run(host="0.0.0.0",port=8099)
    db.close()
    print('good bye')