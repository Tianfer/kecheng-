# -*- coding: UTF-8 -*-
import requests
import json
import pymysql
from PIL import Image
import re
import time
def get_cookie(): #获取登录信息的cookie
    URL = "http://kdjw.hnust.cn/kdjw"
    headers = { "User-Agent":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
                'Connection': 'keep-alive'
                }
    response = requests.get(URL,headers = headers)
    cookie = response.headers['Set-Cookie']
    return str(cookie)

def Vecode(cookie,dict1): # 检验验证码
    URL = 'http://kdjw.hnust.cn/kdjw/verifycode.servlet'
    headers = { 'Cookie' : cookie,
                'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
            }
    response = requests.get(URL,headers = headers)
    address_place = './picture.jpg'
    with open(address_place ,'wb') as fd:
        for chunk in response.iter_content(256):
            fd.write(chunk)
    fd.close()

    im = Image.open(address_place)  #保存验证码图片

    num = ((2,3,12,18),(12,3,22,18),(22,3,32,18),(32,3,42,18))
    fin = ''
    for box in num:
        region = im.crop(box)
        txt = ""
        for i in range(15):
            for j in range(10):
                flag = 0
                for RGB in range(2):
                    if region.getpixel((j,i))[RGB] > 240 :
                        flag += 1
                    else :
                        flag += 0
                if flag != 0:
                    txt += '1'
                else :
                    txt += '0'
        fin += compare(txt,dict1)
    return fin

def compare(txt,dict1): #与数据库中的验证码数据进行对比
    dictnum = ('1','2','3','b','c','m','n','v','x','z')
    max_num = 0
    fin_num = ''
    for i in dictnum:
        num = 0.0
        all_num = 0.0
        for m in range(150):
            if dict1[i][m] == '0':
                all_num += 1
                if txt[m] == dict1[i][m]:
                    num += 1
        if max_num < (num/all_num):
            max_num = num/all_num
            fin_num = i
    return fin_num

def filter_tags(htmlstr): #过滤html
  #先过滤CDATA
  re_cdata=re.compile('//<!\[CDATA\[[^>]*//\]\]>',re.I) #匹配CDATA
  re_script=re.compile('<\s*script[^>]*>[^<]*<\s*/\s*script\s*>',re.I)#Script
  re_style=re.compile('<\s*style[^>]*>[^<]*<\s*/\s*style\s*>',re.I)#style
  re_br=re.compile('<br\s*?/?>')#处理换行
  re_h=re.compile('</?\w+[^>]*>')#HTML标签
  re_comment=re.compile('<!--[^>]*-->')#HTML注释
  s=re_cdata.sub(' ',htmlstr)#去掉CDATA
  s=re_script.sub(' ',s) #去掉SCRIPT
  s=re_style.sub(' ',s)#去掉style
  s=re_br.sub('\n',s)#将br转换为换行
  s=re_h.sub(' ',s) #去掉HTML 标签
  s=re_comment.sub(' ',s)#去掉HTML注释
  #去掉多余的空行
  blank_line=re.compile('\n+')
  s=blank_line.sub('\n',s)
  s=replaceCharEntity(s)#替换实体
  return s

def replaceCharEntity(htmlstr):
    CHAR_ENTITIES={'nbsp':' ','160':' ',
    'lt':'<','60':'<',
    'gt':'>','62':'>',
    'amp':'&','38':'&',
    'quot':'"','34':'"',}
    re_charEntity=re.compile(r'&#?(?P<name>\w+);')
    sz=re_charEntity.search(htmlstr)
    while sz:
        entity=sz.group()#entity全称，如&gt;
        key=sz.group('name')#去除&;后entity,如&gt;为gt
        try:
            htmlstr=re_charEntity.sub(CHAR_ENTITIES[key],htmlstr,1)
            sz=re_charEntity.search(htmlstr)
        except KeyError:
            htmlstr=re_charEntity.sub('',htmlstr,1)
            sz=re_charEntity.search(htmlstr)
    return htmlstr

def check_source_id(stringlist):
    source_id_re = re.compile('\d{15}')
    source_id = source_id_re.search(stringlist)
    source_id = source_id.group()
    return source_id

def check_building_address(stringlist):
    build_re = re.compile(u'\ \ (\u7b2c\u4e94\u6559\u5b66\u697c)?(\u56db\u6559)?(\u9038\u592b\u697c)?(\u7b2c\u4e00\u6559\u5b66\u697c)?(\u7b2c\u516b\u6559\u5b66\u697c)?(\u7b2c\u4e5d\u6559\u5b66\u697c)?(\u5341\u6559\u4e1c\u9644\u697c)?')
    building_name = build_re.finditer(stringlist)
    stri = u''
    addre = 0
    for l in building_name:  # 可以简化
        if l.group() != '  ':
            stri = l.group()
            addre = l.end()
    building = stri.strip()
    if building.encode('UTF-8') == '四教':
        building = u'第四教学楼'
    elif building.encode('UTF-8') == '十教东附楼':
        building = u'第十教学楼东附楼'
    address = stringlist[int(addre):int(addre) + 3]
    return building , address

def check_weekday(stringlist):
    weekday_re = re.compile('\ \ (\d{1,2}\,?\-?\d{1,2}?\,?\-?\d{1,2}(\-\d{1,2})?)?(\d{1,2})?')
    weekday = weekday_re.finditer(stringlist)
    for l in weekday:
        week = l.group()
    wedaylist_re = re.compile('\d{1,2}(\-\d{1,2})?')
    wedaylist = wedaylist_re.finditer(week)
    weekdaylist = []
    for l in wedaylist:
        we_start = re.compile('^\d{1,2}')
        we_end = re.compile('\d{1,2}$')
        week_start = we_start.search(l.group())
        week_end = we_end.search(l.group())
        for num in range(int(week_start.group()), int(week_end.group()) + 1):
            weekdaylist.append(num)
    return weekdaylist

def check_source_name(stringlist):
    source_name_re = re.compile(u'(?<=\ \ )[\u4E00-\u9FA5A-Za-z]+')
    source_name_list = source_name_re.finditer(stringlist)
    for l in source_name_list:
        source_name = l.group()
        break
    return source_name

def check_source_time(stringlist):
    source_day_re = re.compile('(?<=\ \ )\d{5}(?=\ \ )')
    source_day = source_day_re.search(stringlist)
    source_day = source_day.group()
    source_time = source_day[1:5]
    source_day = source_day[0]
    return source_day,source_time

def check_grade(stringlist):
    grade_re = re.compile('^\d{2}')
    grade = grade_re.match(stringlist)
    grade = grade.group()
    grade = grade + u'级'
    return grade

def check_class(stringlist):
    class_re = re.compile(u'[\u4E00-\u9FA5A-Za-z]+\[[0-9](\-[0-9])?\]')
    class_name = class_re.finditer(stringlist)
    class_name_list = []
    for l in class_name:
        class_numre = re.compile('\[[0-9](\-[0-9])?\]')
        class_num = class_numre.finditer(l.group())
        for j in class_num:
            c_number = j.group()
            class_start = int(c_number[1])
            class_end = int(c_number[3]) + 1
            for num in range(class_start, class_end):
                c_na = re.compile(u'[\u4E00-\u9FA5A-Za-z]+')
                c_name = c_na.search(l.group())
                c_name = c_name.group()
                if c_name.encode('UTF-8') == '物联':
                    c_name = u'物联网'
                elif c_name.encode('UTF-8') == '网络':
                    c_name = u'网络安全'
                elif c_name.encode('UTF-8') == '软件':
                    c_name = u'软件工程'
                c_name = c_name + str(num).decode('UTF-8') + u'班'
                class_name_list.append(c_name)
    return class_name_list

if __name__=='__main__':

    connect = pymysql.Connection(
        host = 'localhost',
        port= 3306,
        user= 'root',
        passwd= '123456',
        db = 'python',
        charset='utf8' )
    print '数据库连接成功'

    cursorsql = connect.cursor()
    dictdata = "SELECT * FROM yzm"
    cursorsql.execute(dictdata)
    connect.commit()
    dicta = cursorsql.fetchall()
    dict1 = {}
    for i in dicta :
        dict1[i[0]] = i[1]

    print 'while循环'
    restart = 10000
    while restart >=10000:
        cookie = get_cookie()
        yzm = Vecode(cookie,dict1)

        print 'vecode'
        URL1 = 'http://kdjw.hnust.cn/kdjw/Logon.do?method=logon'
        data = {'PASSWORD':'f123456789zb',
                'RANDOMCODE' : yzm,
                'USERNAME' : '1405020301'}

        headers =  {'Cookie':cookie,
            'User-Agent':"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.90 Safari/537.36",
            'Connection': 'keep-alive'
           }
        login = requests.post(URL1 , headers = headers , data = data)

        URL2 = 'http://kdjw.hnust.cn/kdjw/jiaowu/pkgl/llsykb/llsykb_list.jsp'
        restart = len(login.text)

    print 'while结束'
    cursor = connect.cursor()
    sqldel = "DELETE FROM `year_17_18` WHERE 1"
    cursor.execute(sqldel)
    connect.commit()
    cursor = connect.cursor()
    sqlteacher = "SELECT * FROM teacher where 1"
    print '教师课程'+sqlteacher
    cursor.execute(sqlteacher)
    connect.commit()
    ID = 0

    for teacher in cursor.fetchall():
        data1 = { 'isview' : 1,
            'jg0101id' : teacher[1],
            'teacherid' : teacher[1],
            'type' : 'jg0101',
            'xnxq01id' : '2017-2018-1',
            'yxx' : '05'
        }
        main = requests.post(URL2 , headers = headers , data = data1)
        test1 = filter_tags(main.content)
        #print test1
        re_sourse = re.compile(u'\d{2}[\u4E00-\u9FA5]+\[\d{1}\-\d{1}\][\u4E00-\u9FA5](\,\d{2}[\u4E00-\u9FA5]+\[\d{1}\-\d{1}\][\u4E00-\u9FA5])?\ \ \d{1,3}\ \ \d{15}\ \ [\u4E00-\u9FA5A-Za-z0-9]+(\ \★\ )?\ \ [\u4E00-\u9FA5,]+\ \ [\u4E00-\u9FA5A-Za-z0-9,]+\ \ \d{5}\ \ [\u4E00-\u9FA5A-Za-z0-9]+(\-[1-9])?\ \ (\d{1,2}\,?\-?\d{1,2}?\,?\-?\d{1,2}(\-\d{1,2})?)?(\d{1,2})?')
        test1 = test1.decode('UTF-8')
        wen = re_sourse.finditer(test1)

        teacher_name = teacher[0]
        teacher_id = teacher[1]

        for i in wen:
            print i.group().encode('UTF-8')

            #print(teacher_name.encode('UTF-8'))

            source_id = check_source_id(i.group())
            #print(source_id.encode('UTF-8'))

            building , address = check_building_address(i.group())
            #print(building.encode('UTF-8'))
            #print(address.encode('UTF-8'))

            weekdaylist = check_weekday(i.group())
            #print(weekdaylist)

            source_name = check_source_name(i.group())
            #print(source_name.encode('UTF-8'))

            source_day , source_time = check_source_time(i.group())
            #print(source_day.encode('UTF-8'))
            #print(source_time.encode('UTF-8'))

            grade = check_grade(i.group())
            #print(grade.encode('UTF-8'))

            class_name_list = check_class(i.group())
            #for classname in class_name_list:
            #    print classname.encode('UTF-8')

            class_name = u''
            for classname in class_name_list:
                class_name = class_name + "," + classname
            class_name = class_name[1:]
            #print class_name.encode('UTF-8')

            for week in weekdaylist:
                ID = ID + 1
                #print(ID)
                sqls = "INSERT INTO `year_17_18`(`ID`, `teacher_name`, `source_id`, `source_name`, `grade`, `class_name`, `day`, `time`, `building`, `address`, `week`) VALUES ("
                sqls = sqls + str(ID).decode('UTF-8') + ",'"
                sqls = sqls + teacher_name + "','"
                sqls = sqls + source_id + "','"
                sqls = sqls + source_name + "','"
                sqls = sqls + grade + "','"
                sqls = sqls + class_name + "','"
                sqls = sqls + source_day + "','"
                sqls = sqls + source_time + "','"
                sqls = sqls + building + "','"
                sqls = sqls + address + "','"
                sqls = sqls + str(week) + "')"
                cursor.execute(sqls)
                connect.commit()